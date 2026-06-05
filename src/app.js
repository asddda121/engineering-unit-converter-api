import express from "express";
import helmet from "helmet";
import { convertUnit, listDomains, listUnits } from "./units.js";

function parseValue(rawValue) {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    throw new TypeError("value is required");
  }
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    throw new TypeError("value must be a finite number");
  }
  return value;
}

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true, service: "engineering-unit-converter-api" });
  });

  app.get("/domains", (req, res) => {
    res.json({ domains: listDomains() });
  });

  app.get("/units", (req, res) => {
    const { domain } = req.query;
    if (domain) {
      const units = listUnits(String(domain));
      if (!units) {
        return res.status(404).json({ error: `Unknown domain '${domain}'` });
      }
      return res.json({ domain, units });
    }

    const domains = Object.fromEntries(
      listDomains().map((name) => [name, listUnits(name)])
    );
    return res.json({ domains });
  });

  app.get("/convert", (req, res) => {
    try {
      const result = convertUnit({
        domain: String(req.query.domain ?? ""),
        from: String(req.query.from ?? ""),
        to: String(req.query.to ?? ""),
        value: parseValue(req.query.value)
      });

      return res.json({
        domain: req.query.domain,
        from: req.query.from,
        to: req.query.to,
        input: Number(req.query.value),
        result
      });
    } catch (error) {
      const status = error instanceof RangeError ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  });

  return app;
}
