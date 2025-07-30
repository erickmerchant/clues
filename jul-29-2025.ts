import * as clues from "./clues.ts";

clues.solve(
	`👨‍🌾

austin
farmer

A1
👨‍🎨

bobby
painter

B1
👩‍🎨

diane
painter

C1
👩‍🎨

evie
painter

D1
👩‍🍳

freya
cook

A2
👨‍⚖️

gus
judge

B2
👨‍✈️

hank
pilot

C2
👨‍💼

isaac
clerk

D2
💂‍♂️

john
guard

A3
👨‍🍳

kyle
cook

B3
👩‍✈️

megan
pilot

C3
👩‍⚖️

olive
judge

D3
👩‍🍳

pam
cook

A4
👨‍⚕️

ryan
doctor

B4
👩‍⚕️

sue
doctor

C4
👨‍💼

tom
clerk

D4
👩‍🌾

vicky
farmer

A5
💂‍♂️

will
guard

B5
👩‍✈️

xia
pilot

C5
👨‍💼

zed
clerk

D5
`,
	[
		(scenario) => clues.byname(scenario, "bobby")?.guilty === false,
		(scenario) => clues.byname(scenario, "diane")?.guilty === false,
		(scenario) => clues.byname(scenario, "gus")?.guilty === false,
		(scenario) => clues.byname(scenario, "kyle")?.guilty === false,
		(scenario) => clues.byname(scenario, "pam")?.guilty === false,
		(scenario) => clues.byname(scenario, "austin")?.guilty === true,
		(scenario) => clues.byname(scenario, "freya")?.guilty === true,
		(scenario) => clues.byname(scenario, "hank")?.guilty === true,
		(scenario) => clues.byname(scenario, "isaac")?.guilty === true,
		(scenario) => clues.byname(scenario, "john")?.guilty === true,
		(scenario) => clues.byname(scenario, "megan")?.guilty === true,
		(scenario) => clues.byname(scenario, "olive")?.guilty === true,
		(scenario) => clues.byname(scenario, "ryan")?.guilty === true,
		(scenario) => clues.byname(scenario, "sue")?.guilty === true,
		(scenario) => clues.byname(scenario, "tom")?.guilty === true,
		(scenario) => clues.byname(scenario, "vicky")?.guilty === true,
		(scenario) => clues.byname(scenario, "will")?.guilty === true,
		(scenario) => clues.byname(scenario, "xia")?.guilty === true,

		(scenario) => clues.guilty(clues.leftof(scenario, "zed")).length > 1,

		(scenario) => clues.guilty(clues.bycol(scenario, clues.D)).length === 4,
		(scenario) => clues.innocent(clues.bycol(scenario, clues.B)).length === 3,
		(scenario) => clues.guilty(clues.onedge(scenario)).length === 10,

		(scenario) => clues.guilty(clues.neighbors(scenario, "john")).length === 2,
		(scenario) => {
			const above = clues.guilty(clues.above(scenario, "sue"));

			if (above.length === 2) {
				return clues.between(scenario, above[0].name, above[1].name).length ===
					0;
			}

			return false;
		},
		(scenario) => {
			const colA = clues.innocent(clues.bycol(scenario, clues.A));

			if (colA.length === 1) {
				return clues.neighbors(scenario, "ryan").includes(colA[0]);
			}

			return false;
		},
		(scenario) => {
			const row5 = clues.guilty(clues.byrow(scenario, 5));

			if (row5.length > 1) {
				const first = row5.shift();
				const last = row5.pop();

				if (first && last) {
					if (clues.neighbors(scenario, first.name).includes(last)) return true;

					const between = new Set(
						clues.between(scenario, first.name, last.name),
					);

					return between.intersection(new Set(row5)).size === between.size;
				}
			}

			return false;
		},
		(scenario) => {
			const row4 = clues.innocent(clues.byrow(scenario, 4));

			if (row4.length === 1) {
				return clues.neighbors(scenario, "vicky").includes(row4[0]);
			}

			return false;
		},
		(scenario) => {
			const row2 = clues.innocent(clues.byrow(scenario, 2));

			if (row2.length === 1) {
				return clues.bycol(scenario, clues.B).includes(row2[0]);
			}

			return false;
		},
		(scenario) => {
			const between = clues.guilty(clues.between(scenario, "john", "olive"));

			if (between.length === 1) {
				return clues.bycol(scenario, clues.C).includes(between[0]);
			}

			return false;
		},
		(scenario) => {
			return new Set([
				...clues.innocent(clues.neighbors(scenario, "austin")),
				...clues.innocent(clues.neighbors(scenario, "vicky")),
			]).size === 3;
		},
		(scenario) => {
			return new Set([
				...clues.innocent(clues.neighbors(scenario, "tom")),
				...clues.innocent(clues.neighbors(scenario, "bobby")),
			]).size === 2;
		},
	],
);
