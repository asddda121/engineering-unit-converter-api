# Submission for Archimedes MSN-00014

Mission: REST API for Engineering Unit Conversion

Repository:
https://github.com/asddda121/engineering-unit-converter-api

CI proof:
https://github.com/asddda121/engineering-unit-converter-api/actions/runs/26997069825

## What Was Delivered

I built a standalone REST API for engineering unit conversion with:

- `GET /convert` for conversions.
- `GET /units` to list supported units.
- `GET /domains` to list supported engineering domains.
- 13 domains and 70 units.
- Local deterministic conversion logic; no external conversion APIs.
- Dockerfile for deployment.
- README with API documentation and usage examples.
- Node.js test suite with conversion and HTTP endpoint coverage.
- GitHub Actions CI passing on the submitted repository.

## Domains Covered

- length
- force
- torque
- pressure
- temperature
- voltage
- current
- resistance
- power
- flow
- thermal
- mass
- density

## How To Run

```bash
npm install
npm test
npm start
```

Example:

```bash
curl "http://localhost:3000/convert?domain=pressure&from=bar&to=kPa&value=2.5"
```

Expected result:

```json
{
  "domain": "pressure",
  "from": "bar",
  "to": "kPa",
  "input": 2.5,
  "result": 250
}
```

## Docker

```bash
docker build -t engineering-unit-converter-api .
docker run --rm -p 3000:3000 engineering-unit-converter-api
```

## Payout

Preferred payout address:
Base/EVM: `0x89B57C3dAAe6A521B53EDB58cd1e6de494279cF3`

Alternative if the platform requires Solana:
`8a2Zji4abvni3ca18U9t4TrukN55W3LxrrVNaSTJ4CVo`
