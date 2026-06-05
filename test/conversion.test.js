import test from "node:test";
import assert from "node:assert/strict";
import { convertUnit, listDomains, listUnits } from "../src/units.js";

function closeTo(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test("lists at least eight engineering domains", () => {
  assert.ok(listDomains().length >= 8);
});

test("lists at least fifty units across all domains", () => {
  const total = listDomains().reduce((sum, domain) => sum + listUnits(domain).length, 0);
  assert.ok(total >= 50);
});

test("length conversions", () => {
  closeTo(convertUnit({ domain: "length", value: 1, from: "m", to: "cm" }), 100);
  closeTo(convertUnit({ domain: "length", value: 25.4, from: "mm", to: "in" }), 1);
  closeTo(convertUnit({ domain: "length", value: 1, from: "mi", to: "ft" }), 5280);
  closeTo(convertUnit({ domain: "length", value: 3, from: "km", to: "m" }), 3000);
});

test("force and torque conversions", () => {
  closeTo(convertUnit({ domain: "force", value: 1, from: "lbf", to: "N" }), 4.4482216152605);
  closeTo(convertUnit({ domain: "force", value: 1, from: "kgf", to: "N" }), 9.80665);
  closeTo(convertUnit({ domain: "torque", value: 1, from: "lbf_ft", to: "N_m" }), 1.3558179483314004);
  closeTo(convertUnit({ domain: "torque", value: 12, from: "lbf_in", to: "lbf_ft" }), 1);
});

test("pressure conversions", () => {
  closeTo(convertUnit({ domain: "pressure", value: 1, from: "bar", to: "kPa" }), 100);
  closeTo(convertUnit({ domain: "pressure", value: 1, from: "atm", to: "Pa" }), 101325);
  closeTo(convertUnit({ domain: "pressure", value: 14.695948775513449, from: "psi", to: "atm" }), 1, 1e-8);
  closeTo(convertUnit({ domain: "pressure", value: 760, from: "torr", to: "atm" }), 1, 1e-8);
});

test("temperature conversions", () => {
  closeTo(convertUnit({ domain: "temperature", value: 0, from: "C", to: "F" }), 32);
  closeTo(convertUnit({ domain: "temperature", value: 212, from: "F", to: "C" }), 100);
  closeTo(convertUnit({ domain: "temperature", value: 273.15, from: "K", to: "C" }), 0);
  closeTo(convertUnit({ domain: "temperature", value: 491.67, from: "R", to: "F" }), 32);
});

test("electrical conversions", () => {
  closeTo(convertUnit({ domain: "voltage", value: 3300, from: "mV", to: "V" }), 3.3);
  closeTo(convertUnit({ domain: "current", value: 0.02, from: "A", to: "mA" }), 20);
  closeTo(convertUnit({ domain: "resistance", value: 4.7, from: "kohm", to: "ohm" }), 4700);
  closeTo(convertUnit({ domain: "power", value: 1, from: "hp", to: "W" }), 745.6998715822702);
});

test("flow and thermal conversions", () => {
  closeTo(convertUnit({ domain: "flow", value: 60, from: "L_min", to: "L_s" }), 1);
  closeTo(convertUnit({ domain: "flow", value: 1, from: "m3_h", to: "L_min" }), 16.666666666666668);
  closeTo(convertUnit({ domain: "thermal", value: 12000, from: "BTU_h", to: "ton_refrigeration" }), 1.0000000000000002);
  closeTo(convertUnit({ domain: "thermal", value: 1, from: "kW", to: "BTU_h" }), 3412.14163312794);
});

test("mass and density conversions", () => {
  closeTo(convertUnit({ domain: "mass", value: 1, from: "lb", to: "kg" }), 0.45359237);
  closeTo(convertUnit({ domain: "mass", value: 1000, from: "g", to: "kg" }), 1);
  closeTo(convertUnit({ domain: "density", value: 1, from: "g_cm3", to: "kg_m3" }), 1000);
  closeTo(convertUnit({ domain: "density", value: 62.4279605761446, from: "lb_ft3", to: "kg_m3" }), 1000, 1e-8);
});

test("rejects invalid inputs", () => {
  assert.throws(() => convertUnit({ domain: "length", value: Number.NaN, from: "m", to: "cm" }), TypeError);
  assert.throws(() => convertUnit({ domain: "unknown", value: 1, from: "m", to: "cm" }), RangeError);
  assert.throws(() => convertUnit({ domain: "length", value: 1, from: "kg", to: "cm" }), RangeError);
});
