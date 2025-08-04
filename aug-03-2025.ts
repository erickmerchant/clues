import { C, clue, hint, skip, solve } from "./clues.ts";

solve(`
👩‍🌾

anna
farmer

A1
👩‍⚕️

barb
doctor

Debra has 2 innocent neighbors in column C

B1
👨‍🌾

clyde
farmer

C1
👩‍⚕️

debra
doctor

D1
👨‍🎨

erwin
painter

A2
🕵️‍♀️

flora
sleuth

B2
👨‍⚕️

gabe
doctor

C2
👨‍🎨

hal
painter

D2
👷‍♂️

isaac
builder

A3
👩‍🔧

joyce
mech

B3
👨‍⚖️

kyle
judge

C3
👩‍🔧

linda
mech

D3
🕵️‍♀️

mary
sleuth

A4
💂‍♂️

noah
guard

B4
👩‍🌾

paula
farmer

C4
👨‍⚖️

terry
judge

D4
👷‍♀️

vicky
builder

A5
💂‍♀️

wanda
guard

B5
👨‍⚖️

xavi
judge

C5
👨‍✈️

zach
pilot

D5
`);

clue((s) => s.isinnocent("barb"));

clue("barb", (s) => s.neighbors("debra").col(C).innocent().eq(2));

clue("clyde", (s) => s.job("builder").union(s.job("mech")).innocent().eq(2));

clue(
  "gabe",
  (s) => s.row(3).guilty().eq(3) && s.row(3).guilty().includes("kyle"),
);

clue("kyle", (s) => s.row(3).union(s.row(5)).innocent().eq(3));

clue(
  "vicky",
  (s) => s.job("painter").map((p) => s.directlybelow(p)).innocent().eq(1),
);

clue("joyce", (s) => s.row(1).union(s.row(3)).innocent().eq(5));

clue(
  "anna",
  (s) =>
    s.neighbors("gabe").innocent().eq(4) &&
    s.neighbors("gabe").innocent().includes("clyde"),
);

clue(
  "debra",
  (s) =>
    s.edge().innocent().eq(8) &&
    s.edge().innocent().includes("wanda"),
);

clue(
  "wanda",
  (s) => s.neighbors("anna").union(s.neighbors("xavi")).innocent().eq(3),
);

clue("xavi", (s) => s.below("debra").guilty().connected());

skip("zach");

skip("isaac");

clue(
  "linda",
  (s) => s.neighbors("vicky").union(s.neighbors("clyde")).innocent().eq(6),
);

skip("terry");

clue(
  "paula",
  (s) => s.job("builder").innocent().gt(s.job("sleuth").innocent()),
);

skip("mary");

skip("noah");

hint();
