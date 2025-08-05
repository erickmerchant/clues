import { A, B, clue, D, hint, solve } from "./clues.ts";

solve(`
👮‍♂️

austin
cop

A1
🕵️‍♀️

bonnie
sleuth

B1
👷‍♀️

cheryl
builder

C1
💂‍♀️

donna
guard

D1
👩‍🎨

emma
painter

A2
👨‍🎨

floyd
painter

B2
👨‍💻

gus
coder

C2
👨‍💻

hal
coder

D2
👨‍🎤

isaac
singer

A3
👨‍🎨

jose
painter

B3
👩‍🎤

karen
singer

C3
👩‍💻

laura
coder

D3
🕵️‍♀️

mary
sleuth

A4
🕵️‍♂️

olof
sleuth

B4
👨‍✈️

ronald
pilot

C4
👩‍✈️

susan
pilot

D4
💂‍♂️

terry
guard

A5
👮‍♂️

vince
cop

B5
👷‍♀️

wanda
builder

C5
👮‍♀️

xia
cop

D5
`);

clue("mary", (s) =>
  s.neighbors("gus").guilty().eq(3) &&
  s.neighbors("gus").guilty().includes("donna"));

clue(
  "donna",
  (s) => s.col(B).innocent().eq(2) && s.col(B).innocent().connected(),
);

clue(
  "vince",
  (s) => s.col(D).innocent().eq(3) && s.col(D).innocent().includes("hal"),
);

clue(
  "hal",
  (s) =>
    s.above("xia").guilty().gt(1) && s.above("xia").guilty().includes("donna"),
);

clue("xia", (s) => s.job("painter").union(s.job("sleuth")).innocent().eq(3));

clue(
  "emma",
  (s) => s.job("coder").map((j) => s.directlybelow(j)).innocent().eq(2),
);

clue("karen", (s) => s.below("bonnie").guilty().connected());

clue(
  "floyd",
  (s) => s.neighbors("emma").union(s.neighbors("terry")).innocent().eq(3),
);

clue("olof", (s) => s.col(A).guilty().eq(s.col(B).guilty()));

clue(
  "austin",
  (s) => s.neighbors("mary").union(s.neighbors("hal")).innocent().eq(4),
);

clue(
  "isaac",
  (s) => s.neighbors("xia").union(s.neighbors("hal")).innocent().eq(3),
);

clue("terry", (s) => s.neighbors("ronald").edge().innocent().eq(2));

clue(
  "wanda",
  (s) => s.neighbors("vince").innocent().eq(s.neighbors("emma").innocent()),
);

clue("ronald", (s) => s.neighbors("ronald").innocent().eq(4));

hint();
