# Engineering Unit Converter API

Standalone REST API for engineering unit conversions across mechanical,
electrical, manufacturing, thermal, flow, and material domains.

Built for the Archimedes Market bounty `MSN-00014`.

## Features

- `GET /convert` performs local deterministic conversions.
- `GET /units` lists units globally or for one domain.
- `GET /domains` lists supported conversion domains.
- 12 domains and 65+ units.
- No external conversion API calls.
- Dockerfile included for deployment.
- Native Node.js test suite with 30+ conversion checks.

## Supported Domains

- `length`
- `force`
- `torque`
- `pressure`
- `temperature`
- `voltage`
- `current`
- `resistance`
- `power`
- `flow`
- `thermal`
- `mass`
- `density`

## Quick Start

```bash
npm install
npm test
npm start
```

The API starts on `http://localhost:3000` by default.

## Docker

```bash
docker build -t engineering-unit-converter-api .
docker run --rm -p 3000:3000 engineering-unit-converter-api
```

## API

### `GET /domains`

Returns all supported domains.

```bash
curl http://localhost:3000/domains
```

### `GET /units`

Returns all units grouped by domain.

```bash
curl http://localhost:3000/units
```

Filter by domain:

```bash
curl "http://localhost:3000/units?domain=pressure"
```

### `GET /convert`

Query parameters:

- `domain`: conversion domain
- `from`: source unit
- `to`: target unit
- `value`: finite numeric value

Examples:

```bash
curl "http://localhost:3000/convert?domain=pressure&from=bar&to=kPa&value=2.5"
curl "http://localhost:3000/convert?domain=temperature&from=F&to=C&value=212"
curl "http://localhost:3000/convert?domain=flow&from=m3_h&to=L_min&value=1"
```

Successful response:

```json
{
  "domain": "pressure",
  "from": "bar",
  "to": "kPa",
  "input": 2.5,
  "result": 250
}
```

Invalid requests return a JSON error with `400` for invalid values and `404`
for unknown domains or units.

## Conversion Coverage

The API includes common engineering units for:

- Length: metric and imperial distance.
- Force and torque: SI, pound-force, kilogram-force.
- Pressure: Pa, kPa, MPa, bar, psi, atm, torr, inHg.
- Temperature: Celsius, Fahrenheit, Kelvin, Rankine.
- Electrical: voltage, current, resistance, power.
- Flow: SI volumetric flow, liters, US gpm, cfm.
- Thermal: W, kW, BTU/h, kcal/h, refrigeration tons.
- Mass and density: SI, imperial, manufacturing material units.

## Notes

- All conversions are computed locally from source constants.
- Temperature uses affine conversion through Celsius.
- Other domains use a base-unit factor table.
