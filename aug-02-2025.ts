import { A, B, C, D, parse, print, rule } from "./clues.ts";

parse(`
👨‍🎨

bruce
painter

A1
💂‍♀️

carol
guard

B1
👨‍🏫

daniel
teacher

C1
👨‍🏫

ethan
teacher

D1
👩‍🎨

freya
painter

A2
👩‍🍳

hilda
cook

B2
👨‍💼

isaac
clerk

C2
👨‍🔧

jason
mech

D2
👩‍🍳

katie
cook

A3
👮‍♂️

larry
cop

B3
👮‍♂️

martin
cop

C3
👮‍♀️

nancy
cop

D3
👩‍💼

pam
clerk

A4
💂‍♀️

rose
guard

Any innocent in row 2 is neighboring Carol

B4
👩‍🎨

sofia
painter

C4
👨‍🔧

terry
mech

D4
👷‍♀️

vicky
builder

A5
👷‍♀️

wanda
builder

B5
👨‍💼

xavi
clerk

C5
👨‍🔧

zed
mech

D5
`);

rule((s) => s.isguilty("rose"));

rule(
  "rose",
  (s) => s.neighbors("carol").row(2).innocent().eq(s.row(2).innocent()),
);

rule(
  "jason",
  (s) => s.above("zed").guilty().connected() && s.above("zed").guilty().eq(2),
);

rule(
  "terry",
  (s) => s.innocent().more("mech"),
);

rule(
  "zed",
  (s) => s.neighbors("carol").guilty().eq(s.neighbors("sofia").guilty()),
);

rule(
  "carol",
  (s) => s.neighbors("hilda").innocent().job("painter").eq(1),
);

rule(
  "sofia",
  (s) => s.neighbors("larry").innocent().job("clerk").eq(1),
);

rule(
  "xavi",
  (s) =>
    s.neighbors("martin").intersection(s.neighbors("sofia")).innocent().eq(3),
);

rule(
  "martin",
  (s) => s.above("vicky").intersection(s.neighbors("hilda")).innocent().eq(1),
);

rule(
  "katie",
  (s) => s.neighbors("carol").edge().innocent().eq(1),
);

rule(
  "daniel",
  (s) => s.neighbors("sofia").innocent().eq(4),
);

rule(
  "wanda",
  (s) => s.neighbors("freya").union(s.neighbors("jason")).innocent().eq(2),
);

rule(
  "isaac",
  (s) => s.col(A).innocent().eq(s.col(D).innocent()),
);

rule(
  "vicky",
  (s) => s.neighbors("bruce").union(s.neighbors("sofia")).innocent().eq(5),
);

print();
