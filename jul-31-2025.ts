import { B, C, D, hint, rule, solve } from "./clues.ts";

solve(
  `
👮‍♀️

anna
cop

A1
👩‍🍳

bonnie
cook

B1
👩‍🍳

cheryl
cook

C1
👨‍⚕️

denis
doctor

D1
👮‍♂️

eric
cop

A2
👨‍💼

gabe
clerk

B2
👨‍🍳

henry
cook

C2
👨‍⚕️

isaac
doctor

D2
👨‍🎨

keith
painter

A3
👩‍🎨

linda
painter

B3
👩‍💻

mary
coder

C3
👩‍⚕️

nicole
doctor

D3
👩‍✈️

olivia
pilot

A4
👨‍🏫

peter
teacher

B4
👨‍💻

ryan
coder

C4
👩‍🏫

sue
teacher

D4
👨‍🎨

tyler
painter

A5
👩‍💼

vicky
clerk

B5
👩‍✈️

xena
pilot

C5
👨‍🏫

zed
teacher

D5
`,
);

rule((c) => !c.name("tyler")?.guilty);

rule((c) => {
  const neighbors = c.neighbors("mary").guilty();

  if (neighbors.eq(6)) {
    return neighbors.includes("linda");
  }
});

rule((c) => c.below("keith").innocent().eq(1));

rule((c) => c.left("xena").guilty().eq(c.left("xena").innocent()));

rule((c) => c.row(4).guilty().connected());

rule((c) => c.neighbors("zed").innocent().eq(1));

rule((c) => c.neighbors("ryan").innocent().edge().eq(1));

rule((c) => c.neighbors("mary").intersection(c.above("zed")).innocent().eq(1));

rule((c) => c.neighbors("zed", "olivia").innocent().eq(2));

rule((c) =>
  c.neighbors("mary").intersection(c.neighbors("nicole")).innocent().eq(2)
);

rule((c) => c.neighbors("zed").guilty().eq(c.neighbors("anna").guilty()));

rule((c) => c.neighbors("nicole").guilty().eq(c.neighbors("tyler").guilty()));

rule((c) => c.neighbors("nicole", "keith").innocent().eq(2));

rule((c) => c.neighbors("zed").innocent().eq(c.neighbors("eric").innocent()));

rule((c) =>
  c.neighbors("bonnie").innocent().eq(c.neighbors("ryan").innocent())
);

rule((c) => c.col(B).union(c.col(D)).innocent().eq(2));

rule((c) => c.col(C).union(c.col(D)).innocent().eq(2));

hint();
