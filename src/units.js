const linearDomains = {
  length: {
    baseUnit: "m",
    units: {
      nm: 1e-9,
      um: 1e-6,
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344
    }
  },
  force: {
    baseUnit: "N",
    units: {
      N: 1,
      kN: 1000,
      lbf: 4.4482216152605,
      kgf: 9.80665,
      dyn: 1e-5
    }
  },
  torque: {
    baseUnit: "N_m",
    units: {
      N_m: 1,
      kN_m: 1000,
      lbf_ft: 1.3558179483314004,
      lbf_in: 0.1129848290276167,
      kgf_m: 9.80665
    }
  },
  pressure: {
    baseUnit: "Pa",
    units: {
      Pa: 1,
      kPa: 1000,
      MPa: 1000000,
      bar: 100000,
      mbar: 100,
      psi: 6894.757293168361,
      atm: 101325,
      torr: 133.32236842105263,
      inHg: 3386.38815789
    }
  },
  voltage: {
    baseUnit: "V",
    units: {
      uV: 1e-6,
      mV: 0.001,
      V: 1,
      kV: 1000
    }
  },
  current: {
    baseUnit: "A",
    units: {
      uA: 1e-6,
      mA: 0.001,
      A: 1,
      kA: 1000
    }
  },
  resistance: {
    baseUnit: "ohm",
    units: {
      mohm: 0.001,
      ohm: 1,
      kohm: 1000,
      Mohm: 1000000
    }
  },
  power: {
    baseUnit: "W",
    units: {
      mW: 0.001,
      W: 1,
      kW: 1000,
      hp: 745.6998715822702
    }
  },
  flow: {
    baseUnit: "m3_s",
    units: {
      m3_s: 1,
      m3_h: 1 / 3600,
      L_s: 0.001,
      L_min: 0.001 / 60,
      gpm_us: 0.003785411784 / 60,
      cfm: 0.028316846592 / 60
    }
  },
  thermal: {
    baseUnit: "W",
    units: {
      W: 1,
      kW: 1000,
      BTU_h: 0.2930710701722222,
      kcal_h: 1.1622222222222223,
      ton_refrigeration: 3516.8528420667
    }
  },
  mass: {
    baseUnit: "kg",
    units: {
      mg: 1e-6,
      g: 0.001,
      kg: 1,
      tonne: 1000,
      oz: 0.028349523125,
      lb: 0.45359237
    }
  },
  density: {
    baseUnit: "kg_m3",
    units: {
      kg_m3: 1,
      g_cm3: 1000,
      lb_ft3: 16.01846337396014,
      lb_in3: 27679.904710191
    }
  }
};

const affineDomains = {
  temperature: {
    units: ["C", "F", "K", "R"],
    toBase(value, unit) {
      if (unit === "C") return value;
      if (unit === "F") return (value - 32) * 5 / 9;
      if (unit === "K") return value - 273.15;
      if (unit === "R") return (value - 491.67) * 5 / 9;
      throw new Error(`Unsupported temperature unit: ${unit}`);
    },
    fromBase(value, unit) {
      if (unit === "C") return value;
      if (unit === "F") return value * 9 / 5 + 32;
      if (unit === "K") return value + 273.15;
      if (unit === "R") return (value + 273.15) * 9 / 5;
      throw new Error(`Unsupported temperature unit: ${unit}`);
    }
  }
};

export const domains = {
  ...linearDomains,
  ...affineDomains
};

export function listDomains() {
  return Object.keys(domains).sort();
}

export function listUnits(domain) {
  const spec = domains[domain];
  if (!spec) return null;
  if (spec.units && Array.isArray(spec.units)) return spec.units;
  return Object.keys(spec.units).sort();
}

export function convertUnit({ domain, from, to, value }) {
  const spec = domains[domain];
  if (!spec) {
    const supported = listDomains().join(", ");
    throw new RangeError(`Unsupported domain '${domain}'. Supported domains: ${supported}`);
  }

  if (!Number.isFinite(value)) {
    throw new TypeError("value must be a finite number");
  }

  if (domain === "temperature") {
    if (!spec.units.includes(from) || !spec.units.includes(to)) {
      throw new RangeError(`Unsupported unit for temperature. Supported units: ${spec.units.join(", ")}`);
    }
    return spec.fromBase(spec.toBase(value, from), to);
  }

  if (!Object.prototype.hasOwnProperty.call(spec.units, from)) {
    throw new RangeError(`Unsupported source unit '${from}' for ${domain}`);
  }
  if (!Object.prototype.hasOwnProperty.call(spec.units, to)) {
    throw new RangeError(`Unsupported target unit '${to}' for ${domain}`);
  }

  return value * spec.units[from] / spec.units[to];
}
