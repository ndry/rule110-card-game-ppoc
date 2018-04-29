export type CellValue = number;

const rule = [[[
  0, 1
], [
  1, 1
]], [[
  0, 1
], [
  1, 0
]]];

export function step(current: CellValue[]): CellValue[] {
  const next = Array.from({length: current.length}, () => 0);

  for (let i = 0; i < current.length; i++) {
    const l = (current.length + i - 1) % current.length;
    const r = (i + 1) % current.length;
    next[i] = rule[current[l]][current[i]][current[r]];
  }

  return next;
}

export function simulateSteps(state: CellValue[], steps: number): CellValue[][] {
  const result = [state];

  for (let i = 0; i < steps; i++) {
    result.push(step(result[result.length - 1]));
  }

  return result;
}
