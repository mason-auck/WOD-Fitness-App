export type UnitSystem = "imperial" | "metric";

export const UNIT_OPTIONS: {
  value: UnitSystem;
  label: string;
  description: string;
}[] = [
  {
    value: "imperial",
    label: "Imperial",
    description: "Pounds (lb)",
  },
  {
    value: "metric",
    label: "Metric",
    description: "Kilograms (kg)",
  },
];

export function getWeightUnitLabel(system: UnitSystem): string {
  return system === "imperial" ? "lb" : "kg";
}

export function getWeightUnitName(system: UnitSystem): string {
  return system === "imperial" ? "Pounds" : "Kilograms";
}
