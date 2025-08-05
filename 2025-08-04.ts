import { A, B, clue, hint, skip, solve } from "./clues.ts";

solve(`
👨‍🔧

austin
mech

A1
👩‍⚕️

barb
doctor

B1
🕵️‍♀️

diane
sleuth

C1
👨‍🔧

erwin
mech

D1
👩‍✈️

flora
pilot

A2
👨‍⚕️

gabe
doctor

B2
🕵️‍♀️

hilda
sleuth

C2
👨‍🌾

isaac
farmer

D2
👨‍🎨

jose
painter

A3
👷‍♂️

kevin
builder

B3
👷‍♀️

megan
builder

C3
👩‍🌾

nancy
farmer

D3
👩‍🎨

olive
painter

A4
👩‍✈️

paula
pilot

B4
🕵️‍♂️

rob
sleuth

C4
👩‍⚕️

sarah
doctor

D4
👨‍🍳

terry
cook

A5
👩‍🍳

vicky
cook

B5
👨‍🎨

will
painter

C5
👨‍🍳

xavi
cook

D5
`);

clue((s) => s.isinnocent("austin"));

clue("austin", (s) => s.left("diane").innocent().eq(s.left("diane").guilty()));

clue(
  "barb",
  (s) => s.job("pilot").map((p) => s.directlyabove(p)).guilty().eq(1),
);

clue(
  "kevin",
  (s) =>
    s.above("terry").guilty().eq(2) && s.above("terry").guilty().connected(),
);

clue(
  "jose",
  (s) => s.neighbors("austin").intersection(s.above("vicky")).innocent().eq(1),
);

clue(
  "gabe",
  (s) => s.neighbors("jose").guilty().gt(s.neighbors("jose").innocent()),
);

clue(
  "paula",
  (s) =>
    s.between("austin", "olive").innocent().eq(
      s.between("austin", "olive").guilty(),
    ),
);

skip("flora");

clue("olive", (s) => s.col(B).innocent().eq(1));

clue("vicky", (s) => s.col(A).innocent().connected());

clue("terry", (s) => s.job("mech").innocent().odd());

clue("erwin", (s) => s.above("nancy").innocent().eq(s.above("nancy").guilty()));

clue("isaac", (s) => s.neighbors("barb").innocent().edge().eq(2));

clue(
  "diane",
  (s) => s.neighbors("megan").intersection(s.above("sarah")).innocent().eq(1),
);

clue(
  "nancy",
  (s) => s.neighbors("olive").union(s.neighbors("erwin")).innocent().eq(2),
);

clue(
  "hilda",
  (s) => s.neighbors("gabe").intersection(s.below("diane")).innocent().eq(1),
);

clue(
  "megan",
  (s) => s.between("isaac", "xavi").guilty().odd(),
);

clue(
  "sarah",
  (s) => s.neighbors("olive").union(s.neighbors("nancy")).innocent().eq(3),
);

clue(
  "rob",
  (s) => s.neighbors("isaac").innocent().gt(s.neighbors("vicky").innocent()),
);

clue(
  "will",
  (s) => s.neighbors("jose").union(s.neighbors("sarah")).innocent().eq(2),
);

hint();
