import { brightGreen, brightMagenta, brightRed } from "@std/fmt/colors";

type Suspect = {
  col: number;
  row: number;
  name: string;
  job: string;
};

type SuspectWithVerdict = Suspect & { guilty: boolean };

type Rule = (clue: Clue) => boolean | undefined;

class Clue {
  static empty = new Clue([]);

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

  filter(cb: (s: SuspectWithVerdict) => boolean): Clue {
    return new Clue(this.list.filter(cb));
  }

  guilty(): Clue {
    return this.filter((s) => s.guilty);
  }

  innocent(): Clue {
    return this.filter((s) => !s.guilty);
  }

  col(
    col: number,
  ): Clue {
    return this.filter((s) => s.col === col);
  }

  row(
    row: number,
  ): Clue {
    return this.filter((s) => s.row === row);
  }

  edge(): Clue {
    return this.filter((s) =>
      s.row === 1 || s.row === 5 || s.col === 1 || s.col === 4
    );
  }

  right(
    named: string | SuspectWithVerdict | undefined,
  ): Clue {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.filter((s) => s.row === named.row && s.col > named.col);
    }

    return Clue.empty;
  }

  left(
    named: string | SuspectWithVerdict | undefined,
  ): Clue {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.filter((s) => s.row === named.row && s.col < named.col);
    }

    return Clue.empty;
  }

  above(
    named: string | SuspectWithVerdict | undefined,
  ): Clue {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.filter((s) => s.col === named.col && s.row < named.row);
    }

    return Clue.empty;
  }

  below(
    named: string | SuspectWithVerdict | undefined,
  ): Clue {
    if (typeof named === "string") {
      named = this.name(named);
    }

    if (named) {
      return this.filter((s) => s.col === named.col && s.row > named.row);
    }

    return Clue.empty;
  }

  between(
    named1: string | SuspectWithVerdict | undefined,
    named2: string | SuspectWithVerdict | undefined,
  ): Clue {
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

    return Clue.empty;
  }

  neighbors(
    ...named: Array<string | SuspectWithVerdict | undefined>
  ): Clue {
    if (named.length > 1) {
      let combined = new Clue([]);
      const names: Array<string> = [];

      for (let n of named) {
        if (n == null) continue;

        if (typeof n !== "string") {
          n = n.name;
        }

        names.push(n);

        combined = combined.union(this.neighbors(n));
      }

      // return combined.filter((s) => !names.includes(s.name));

      return combined;
    }

    if (named.length === 1) {
      let n = named[0];

      if (typeof n === "string") {
        n = this.name(n);
      }

      if (n != null) {
        return this.filter((s) =>
          s.name !== n.name &&
          (s.row === n.row || s.row === n.row - 1 ||
            s.row === n.row + 1) &&
          (s.col === n.col || s.col === n.col - 1 ||
            s.col === n.col + 1)
        );
      }
    }

    return Clue.empty;
  }

  job(
    job: string,
  ): Clue {
    return this.filter((s) => s.job === job);
  }

  notjob(
    job: string,
  ): Clue {
    return this.filter((s) => s.job !== job);
  }

  gt(num: number | Clue): boolean {
    if (num instanceof Clue) {
      num = num.list.length;
    }

    return this.list.length > num;
  }

  lt(num: number | Clue): boolean {
    if (num instanceof Clue) {
      num = num.list.length;
    }

    return this.list.length < num;
  }

  gte(num: number | Clue): boolean {
    if (num instanceof Clue) {
      num = num.list.length;
    }

    return this.list.length >= num;
  }

  lte(num: number | Clue): boolean {
    if (num instanceof Clue) {
      num = num.list.length;
    }

    return this.list.length <= num;
  }

  eq(num: number | Clue): boolean {
    if (num instanceof Clue) {
      num = num.list.length;
    }

    return this.list.length === num;
  }

  neq(num: number | Clue): boolean {
    if (num instanceof Clue) {
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

  union(other: Clue): Clue {
    return new Clue(this.set().union(other.set()));
  }

  intersection(other: Clue): Clue {
    return new Clue(this.set().intersection(other.set()));
  }
}

export const A = 1;
export const B = 2;
export const C = 3;
export const D = 4;

let permutations = 2 ** 20;
let scenarios: Array<number> = [];
const hints: Array<Array<string>> = [];
const suspects: Array<Suspect> = [];

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

  // console.log(suspects);

  while (permutations > -1) {
    scenarios.push(permutations);

    permutations -= 1;
  }
}

export function rule(rule: Rule) {
  const relevant: Array<Clue> = [];

  scenarios = scenarios.filter((scenario) => {
    const list = [];

    for (let i = 0; i < suspects.length; i++) {
      list.push({ ...suspects[i], guilty: (scenario & 1) === 1 });

      scenario >>= 1;
    }

    const clue = new Clue(list);
    const result = rule(clue);

    if (result) relevant.push(clue);

    return result;
  });

  hints.unshift([]);

  const hint = brightMagenta("remaining scenarios: ") + scenarios.length;

  if (!hints.some((h) => h.includes(hint))) {
    hints[0].push(hint);
  }

  const primary = relevant[0];

  if (primary) {
    loop: for (let i = 0; i < primary.list.length; i++) {
      for (let x = 1; x < relevant.length; x++) {
        const clue = relevant[x];

        if (primary.list[i].guilty !== clue.list[i].guilty) {
          continue loop;
        }
      }

      const hint = primary.list[i].guilty
        ? brightRed(primary.list[i].name + " is guilty")
        : brightGreen(primary.list[i].name + " is innocent");

      if (!hints.some((h) => h.includes(hint))) {
        hints[0].push(hint);
      }
    }
  }
}

export function hint() {
  for (const h of hints[0]) {
    console.log(h);
  }
}
