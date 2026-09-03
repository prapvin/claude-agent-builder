import http from "node:http";
import worker from "./worker/index.js";

const port = Number(process.env.PORT || 8080);

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/healthz") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || "localhost:" + port;
    const request = new Request(protocol + "://" + host + req.url, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method || "GET") ? undefined : body,
    });

    const response = await worker.fetch(request, process.env, {});
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error("Request failed", error);
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log("Claude Agent Builder listening on port " + port);
});
