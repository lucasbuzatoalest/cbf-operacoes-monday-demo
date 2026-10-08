import http from "node:http";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicRoot = join(root, "public");
const seed = JSON.parse(await readFile(join(root, "data", "demo-data.json"), "utf8"));
let state = structuredClone(seed);
let brazilStatesCache;
const execFileAsync = promisify(execFile);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const sendJson = (res, status, body) => {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  });
  res.end(JSON.stringify(body));
};

const readJson = async (req) => {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 100_000) throw new Error("Payload muito grande");
  }
  return body ? JSON.parse(body) : {};
};

const findById = (collection, id) => state[collection].find((entry) => entry.id === id);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, service: "cbf-estadios-governanca", mode: "demonstration" });
  }

  if (req.method === "GET" && url.pathname === "/api/demo-data") {
    return sendJson(res, 200, state);
  }

  if (req.method === "GET" && url.pathname === "/api/brazil-states") {
    try {
      if (!brazilStatesCache) {
        const source = "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application%2Fvnd.geo%2Bjson&qualidade=minima&intrarregiao=UF";
        let body;
        try {
          const response = await fetch(source, { signal: AbortSignal.timeout(12_000) });
          if (!response.ok) throw new Error(`IBGE respondeu ${response.status}`);
          body = await response.json();
        } catch {
          const { stdout } = await execFileAsync("curl", ["-fsSL", "--max-time", "12", source], { maxBuffer: 2_000_000 });
          body = JSON.parse(stdout);
        }
        if (body?.type !== "FeatureCollection" || body.features?.length !== 27) throw new Error("Malha estadual incompleta");
        brazilStatesCache = body;
      }
      return sendJson(res, 200, brazilStatesCache);
    } catch (error) {
      return sendJson(res, 502, { error: "Não foi possível carregar a malha oficial do IBGE.", detail: error.message });
    }
  }

  const approvalMatch = url.pathname.match(/^\/api\/evaluations\/([^/]+)\/approval$/);
  if (req.method === "POST" && approvalMatch) {
    try {
      const payload = await readJson(req);
      const evaluation = findById("evaluations", approvalMatch[1]);
      if (!evaluation) return sendJson(res, 404, { error: "Avaliação não encontrada" });
      if (!payload.justification?.trim() || !payload.reviewer?.trim()) {
        return sendJson(res, 400, { error: "Revisor e justificativa são obrigatórios" });
      }
      if (!['Aprovada', 'Reprovada', 'Em revisão'].includes(payload.decision)) {
        return sendJson(res, 400, { error: "Decisão inválida" });
      }
      if (payload.decision === "Aprovada" && evaluation.technicalResult !== "Atende") {
        return sendJson(res, 409, { error: "A demonstração impede aprovação quando o resultado técnico não é 'Atende'." });
      }
      evaluation.approval = payload.decision;
      evaluation.reviewer = payload.reviewer.trim();
      evaluation.approvalJustification = payload.justification.trim();
      evaluation.approvedAt = new Date().toISOString();
      return sendJson(res, 200, evaluation);
    } catch (error) {
      return sendJson(res, 400, { error: error.message || "Requisição inválida" });
    }
  }

  const decisionMatch = url.pathname.match(/^\/api\/requests\/([^/]+)\/decision$/);
  if (req.method === "POST" && decisionMatch) {
    try {
      const payload = await readJson(req);
      const request = findById("gameRequests", decisionMatch[1]);
      if (!request) return sendJson(res, 404, { error: "Solicitação não encontrada" });
      if (!payload.justification?.trim() || !payload.approver?.trim()) {
        return sendJson(res, 400, { error: "Aprovador e justificativa são obrigatórios" });
      }
      if (!['Aprovada', 'Reprovada', 'Condicionada', 'Em análise'].includes(payload.decision)) {
        return sendJson(res, 400, { error: "Decisão inválida" });
      }
      if (payload.decision === "Aprovada" && (request.availability !== "Disponível" || request.technicalAnalysis !== "Favorável")) {
        return sendJson(res, 409, { error: "A demonstração exige disponibilidade e análise técnica favorável antes da aprovação." });
      }
      request.decision = payload.decision;
      request.approver = payload.approver.trim();
      request.justification = payload.justification.trim();
      request.decidedAt = new Date().toISOString();
      return sendJson(res, 200, request);
    } catch (error) {
      return sendJson(res, 400, { error: error.message || "Requisição inválida" });
    }
  }

  if (req.method === "POST" && url.pathname === "/api/reset") {
    state = structuredClone(seed);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    return sendJson(res, 405, { error: "Método não permitido" });
  }

  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = normalize(join(publicRoot, requested));
  if (!filePath.startsWith(publicRoot)) return sendJson(res, 403, { error: "Acesso negado" });

  try {
    const content = await readFile(filePath);
    res.writeHead(200, {
      "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "cache-control": extname(filePath) === ".html" ? "no-store" : "public, max-age=300",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; connect-src 'self' https://api.monday.com https://servicodados.ibge.gov.br; img-src 'self' data:; frame-ancestors https://*.monday.com"
    });
    if (req.method === "HEAD") return res.end();
    res.end(content);
  } catch {
    sendJson(res, 404, { error: "Recurso não encontrado" });
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, "0.0.0.0", () => {
  console.log(`CBF demo disponível na porta ${port}`);
});
