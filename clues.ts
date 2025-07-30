type Suspect = {
	col: number;
	row: number;
	name: string;
	job: string;
};

type SuspectWithVerdict = Suspect & { guilty: boolean };

export const A = 1;
export const B = 2;
export const C = 3;
export const D = 4;

export function solve(
	copied: string,
	rules: Array<
		(scenario: Array<SuspectWithVerdict>) => boolean | undefined
	>,
) {
	const suspects: Array<Suspect> = [];
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

	console.log(suspects);

	let permutations = 2 ** 20;
	const scenarios: Array<Array<SuspectWithVerdict>> = [];

	loop: while (permutations > -1) {
		let p = permutations;
		const scenario: Array<SuspectWithVerdict> = [];

		for (const suspect of suspects) {
			scenario.push({ ...suspect, guilty: (p & 1) === 1 });

			p >>= 1;
		}

		permutations -= 1;

		for (const rule of rules) {
			if (!rule(scenario)) {
				continue loop;
			}
		}

		scenarios.push(scenario);
	}

	console.log(scenarios.length);

	const primary = scenarios.pop();

	if (primary) {
		loop: for (let i = 0; i < primary.length; i++) {
			for (const scenario of scenarios) {
				if (primary[i].guilty !== scenario[i].guilty) {
					continue loop;
				}
			}

			console.log(
				primary[i].name + " is " + (primary[i].guilty ? "guilty" : "innocent"),
			);
		}
	}
}

export function neighbors(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) =>
			s !== named &&
			(s.row === named.row || s.row === named.row - 1 ||
				s.row === named.row + 1) &&
			(s.col === named.col || s.col === named.col - 1 ||
				s.col === named.col + 1)
		);
	}

	return [];
}

export function byname(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): SuspectWithVerdict | undefined {
	return scenario.find((s) => s.name === name);
}

export function byjob(
	scenario: Array<SuspectWithVerdict>,
	job: string,
): Array<SuspectWithVerdict> {
	return scenario.filter((s) => s.job === job);
}

export function bynotjob(
	scenario: Array<SuspectWithVerdict>,
	job: string,
): Array<SuspectWithVerdict> {
	return scenario.filter((s) => s.job !== job);
}

export function chunkedbyjob(
	scenario: Array<SuspectWithVerdict>,
): Array<SuspectWithVerdict> {
	const grouped = Object.groupBy(scenario, (s) => s.job) as Record<
		string,
		Array<SuspectWithVerdict>
	>;

	return Object.values(grouped).flat();
}

export function guilty(
	scenario: Array<SuspectWithVerdict>,
): Array<SuspectWithVerdict> {
	return scenario.filter((s) => s.guilty);
}

export function innocent(
	scenario: Array<SuspectWithVerdict>,
): Array<SuspectWithVerdict> {
	return scenario.filter((s) => !s.guilty);
}

export function bycol(
	scenario: Array<SuspectWithVerdict>,
	col: number,
): Array<SuspectWithVerdict> {
	return scenario.filter((s) => s.col === col);
}

export function byrow(
	scenario: Array<SuspectWithVerdict>,
	row: number,
): Array<SuspectWithVerdict> {
	return scenario.filter((s) => s.row === row);
}

export function onedge(
	scenario: Array<SuspectWithVerdict>,
): Array<SuspectWithVerdict> {
	return scenario.filter((s) =>
		s.row === 1 || s.row === 5 || s.col === 1 || s.col === 4
	);
}

export function rightof(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) => s.row === named.row && s.col > named.col);
	}

	return [];
}

export function leftof(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) => s.row === named.row && s.col < named.col);
	}

	return [];
}

export function above(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) => s.col === named.col && s.row < named.row);
	}

	return [];
}

export function below(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) => s.col === named.col && s.row > named.row);
	}

	return [];
}

export function between(
	scenario: Array<SuspectWithVerdict>,
	name1: string,
	name2: string,
): Array<SuspectWithVerdict> {
	const named1 = scenario.find((s) => s.name === name1);
	const named2 = scenario.find((s) => s.name === name2);

	if (named1 && named2) {
		return scenario.filter((s) => {
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

	return [];
}

export function directrightof(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) =>
			s.row === named.row && s.col === named.col + 1
		);
	}

	return [];
}

export function directleftof(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) =>
			s.row === named.row && s.col === named.col - 1
		);
	}

	return [];
}

export function directabove(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) =>
			s.col === named.col && s.row === named.row - 1
		);
	}

	return [];
}

export function directbelow(
	scenario: Array<SuspectWithVerdict>,
	name: string,
): Array<SuspectWithVerdict> {
	const named = scenario.find((s) => s.name === name);

	if (named) {
		return scenario.filter((s) =>
			s.col === named.col && s.row === named.row + 1
		);
	}

	return [];
}
