import { brightGreen, brightRed } from "@std/fmt/colors";

type Suspect = {
  col: number;
  row: number;
  name: string;
  job: string;
};

type SuspectWithVerdict = Suspect & { guilty: boolean };

type Clue = (scenario: Scenario) => boolean | undefined;

class Scenario {
  static empty = new Scenario([]);

  list: Array<SuspectWithVerdict>;

  constructor(list: Array<SuspectWithVerdict> | Set<SuspectWithVerdict>) {
    if (list instanceof Set) {
      list = [...list];
    }

    this.list = list;
  }

  name(
    name: string,
  ): SuspectWithVerdict | undefined {
    return this.list.find((s) => s.name === name);
  }

  first(): SuspectWithVerdict | undefined {
    return this.list[0];
  }

  last(): SuspectWithVerdict | undefined {
    return this.list[this.list.length - 1];
  }

  filter(cb: (s: SuspectWithVerdict) => boolean): Scenario {
    return new Scenario(this.list.filter(cb));
  }

  map(cb: (s: SuspectWithVerdict) => SuspectWithVerdict | Scenario): Scenario {
    let result = new Scenario([]);

    for (const item of this.list) {
      const r = cb(item);

      if (r instanceof Scenario) {
        result = result.union(r);
      } else {
        result.list.push(r);
      }
    }

    return result;
  }

  guilty(): Scenario {
    return this.filter((s) => s.guilty);
  }

  innocent(): Scenario {
    return this.filter((s) => !s.guilty);
  }

  isguilty(name: string): boolean {
    return this.name(name)?.guilty === false;
  }

  isinnocent(name: string): boolean {
    return this.name(name)?.guilty === true;
  }

  col(
    col: number,
  ): Scenario {
    return this.filter((s) => s.col === col);
  }

  row(
    row: number,
  ): Scenario {
    return this.filter((s) => s.row === row);
  }

  edge(): Scenario {
    return this.filter((s) =>
      s.row === 1 || s.row === 5 || s.col === 1 || s.col === 4
    );
  }

  right(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.filter((s) => s.row === named.row && s.col > named.col);
    }

    return Scenario.empty;
  }

  left(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.filter((s) => s.row === named.row && s.col < named.col);
    }

    return Scenario.empty;
  }

  above(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.filter((s) => s.col === named.col && s.row < named.row);
    }

    return Scenario.empty;
  }

  below(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.filter((s) => s.col === named.col && s.row > named.row);
    }

    return Scenario.empty;
  }

  directlyright(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    const result = this.right(named);

    result.list.splice(1, Infinity);

    return result;
  }

  directlyleft(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    const result = this.left(named);

    result.list.splice(0, result.list.length - 1);

    return result;
  }

  directlyabove(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    const result = this.above(named);

    result.list.splice(0, result.list.length - 1);

    return result;
  }

  directlybelow(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    const result = this.below(named);

    result.list.splice(1, Infinity);

    return result;
  }

  between(
    named1: string | SuspectWithVerdict | undefined,
    named2: string | SuspectWithVerdict | undefined,
  ): Scenario {
    named1 = typeof named1 === "string" ? this.name(named1) : named1;
    named2 = typeof named2 === "string" ? this.name(named2) : named2;

    if (named1 && named2) {
      return this.filter((s) => {
        const colcase = s.col === named1.col && s.col === named2.col &&
          (
            (s.row < named1.row && s.row > named2.row) ||
            (s.row > named1.row && s.row < named2.row)
          );
        const rowcase = s.row === named1.row && s.row === named2.row &&
          (
            (s.col < named1.col && s.col > named2.col) ||
            (s.col > named1.col && s.col < named2.col)
          );

        return (
          colcase ||
          rowcase
        ) &&
          s !== named1 && s !== named2;
      });
    }

    return Scenario.empty;
  }

  neighbors(
    named: string | SuspectWithVerdict | undefined,
  ): Scenario {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named != null) {
      return this.filter((s) =>
        s.name !== named.name &&
        (s.row === named.row || s.row === named.row - 1 ||
          s.row === named.row + 1) &&
        (s.col === named.col || s.col === named.col - 1 ||
          s.col === named.col + 1)
      );
    }

    return Scenario.empty;
  }

  job(
    job: string,
  ): Scenario {
    return this.filter((s) => s.job === job);
  }

  notjob(
    job: string,
  ): Scenario {
    return this.filter((s) => s.job !== job);
  }

  gt(num: number | Scenario): boolean {
    if (num instanceof Scenario) {
      num = num.list.length;
    }

    return this.list.length > num;
  }

  lt(num: number | Scenario): boolean {
    if (num instanceof Scenario) {
      num = num.list.length;
    }

    return this.list.length < num;
  }

  gte(num: number | Scenario): boolean {
    if (num instanceof Scenario) {
      num = num.list.length;
    }

    return this.list.length >= num;
  }

  lte(num: number | Scenario): boolean {
    if (num instanceof Scenario) {
      num = num.list.length;
    }

    return this.list.length <= num;
  }

  eq(num: number | Scenario): boolean {
    if (num instanceof Scenario) {
      num = num.list.length;
    }

    return this.list.length === num;
  }

  neq(num: number | Scenario): boolean {
    if (num instanceof Scenario) {
      num = num.list.length;
    }

    return this.list.length !== num;
  }

  includes(named: string | SuspectWithVerdict | undefined): boolean {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.list.find((s) => s.name === named.name) != null;
    }

    return false;
  }

  connected(): boolean {
    if (this.list.length < 2) return true;

    this.list.sort((a, b) => ((a.col + a.row) * 4) - ((b.col + b.row) * 4));

    const { col, row } = this.list[0];

    if (this.list.every((s) => s.col === col)) {
      return this.list.every((s, i) => s.row === row + i);
    }

    if (this.list.every((s) => s.row === row)) {
      return this.list.every((s, i) => s.col === col + i);
    }

    return false;
  }

  set(): Set<SuspectWithVerdict> {
    return new Set(this.list);
  }

  union(other: Scenario): Scenario {
    return new Scenario(this.set().union(other.set()));
  }

  intersection(other: Scenario): Scenario {
    return new Scenario(this.set().intersection(other.set()));
  }

  more(job: string): boolean {
    const others: Record<string, number> = {};
    let total = 0;

    for (const suspect of this.list) {
      if (suspect.job === job) {
        total += 1;

        continue;
      }

      others[suspect.job] ??= 0;

      others[suspect.job] += 1;
    }

    return Object.values(others).every((v) => total > v);
  }

  less(job: string): boolean {
    const others: Record<string, number> = {};
    let total = 0;

    for (const suspect of this.list) {
      if (suspect.job === job) {
        total += 1;

        continue;
      }

      others[suspect.job] ??= 0;

      others[suspect.job] += 1;
    }

    return Object.values(others).every((v) => total < v);
  }
}

export const A = 1;
export const B = 2;
export const C = 3;
export const D = 4;

let totalPermutations = 2 ** 20;
let permutations: Array<number> = [];
const clueNames: Array<string> = [];
const suspects: Array<Suspect | SuspectWithVerdict> = [];

export function solve(
  copied: string,
) {
  const lines = copied.split(/\n([A-D][0-9])/g).map((ln) => ln.trim())
    .filter((
      ln,
    ) => ln.length > 0);

  while (lines.length > 1) {
    const details = lines.shift?.()?.split?.("\n");
    const id = lines?.shift()?.split("");
    const col = ["", "A", "B", "C", "D"].indexOf(id?.[0] ?? "");
    const row = +(id?.[1] ?? "");

    if (details != null && details.length >= 4) {
      const [_emoji, _, name, job] = details;

      suspects.push({ col, row, name, job });
    }
  }

  if (suspects.length != 20) throw new RangeError("too few suspects");

  while (totalPermutations > -1) {
    permutations.push(totalPermutations);

    totalPermutations -= 1;
  }
}

export function skip(name: string) {
  clueNames.push(name);
}

export function clue(name: string | Clue, clue?: Clue) {
  if (typeof name !== "function") clueNames.push(name);
  else {
    clue = name;
  }

  if (clue == null) return;

  permutations = permutations.filter((p) => {
    const list = [];

    for (let i = 0; i < suspects.length; i++) {
      list.push({ ...suspects[i], guilty: (p & 1) === 1 });

      p >>= 1;
    }

    const scenario = new Scenario(list);
    const result = clue(scenario);

    return result;
  });
}

export function hint() {
  const first = permutations[0];
  const rest = permutations.slice(1);

  loop: for (let i = 0; i < suspects.length; i++) {
    if (!("guilty" in suspects[i])) {
      for (const current of rest) {
        if (((current >> i & 1) === 1) !== ((first >> i & 1) === 1)) {
          continue loop;
        }
      }

      suspects[i] = { ...suspects[i], guilty: (first >> i & 1) === 1 };
    }
  }

  for (const suspect of suspects) {
    let text = `${
      ["", "A", "B", "C", "D"][suspect.col]
    }${suspect.row} ${suspect.name} ${suspect.job}`;

    if ("guilty" in suspect) {
      if (suspect.guilty) {
        text += " guilty";
      } else {
        text += " innocent";
      }

      if (!clueNames.includes(suspect.name)) {
        text += " *";

        if (suspect.guilty) {
          text = brightRed(text);
        } else {
          text = brightGreen(text);
        }
      }
    }

    console.log(text);
  }

  console.log(
    `----------------------\nremaining permutations: ${permutations.length}\n* = new verdict`,
  );
}
