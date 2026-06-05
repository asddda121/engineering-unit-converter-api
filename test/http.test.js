import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

async function withServer(fn) {
  const server = createApp().listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  try {
    const { port } = server.address();
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("GET /domains returns supported domains", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/domains`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.domains.includes("length"));
    assert.ok(body.domains.includes("temperature"));
    assert.ok(body.domains.includes("density"));
  });
});

test("GET /units returns units for a domain", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/units?domain=pressure`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.domain, "pressure");
    assert.ok(body.units.includes("psi"));
    assert.ok(body.units.includes("kPa"));
  });
});

test("GET /convert performs a conversion", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/convert?domain=pressure&from=bar&to=kPa&value=2.5`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.result, 250);
  });
});

test("GET /convert rejects unknown units", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/convert?domain=length&from=kg&to=m&value=1`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.match(body.error, /Unsupported source unit/);
  });
});
