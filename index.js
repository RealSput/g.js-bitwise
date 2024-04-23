require('@g-js-api/g.js');

let bin1 = Array(16).fill(0).map(x => counter(x));
let bin2 = Array(16).fill(0).map(x => counter(x));
/*
bin1.forEach((x, i) => x.display(30 * i, 105));
bin2.forEach((x, i) => x.display(30 * i, 60));
*/
let num_to_bin1 = trigger_function(() => {
	for (let i = bin1.length - 1; i >= 0; i--) {
		let tr = trigger_function(() => {
			counter(0, true).subtract(2 ** i);
			bin1[15 - i].set(1);
		});
		counter(0, true).if_is(SMALLER_THAN, 2 ** i, trigger_function(() => bin1[15 - i].set(0))); // this is here so leftover bits from last usage are not kept
		counter(0, true).if_is(EQUAL_TO, 2 ** i, tr);
		counter(0, true).if_is(LARGER_THAN, 2 ** i, tr);
	};
});

let num_to_bin2 = trigger_function(() => {
	for (let i = bin2.length - 1; i >= 0; i--) {
		let tr = trigger_function(() => {
			counter(0, true).subtract(2 ** i);
			bin2[15 - i].set(1);
		});
		counter(0, true).if_is(SMALLER_THAN, 2 ** i, trigger_function(() => bin2[15 - i].set(0)));
		counter(0, true).if_is(EQUAL_TO, 2 ** i, tr);
		counter(0, true).if_is(LARGER_THAN, 2 ** i, tr);
	};
});

let bin_to_num = trigger_function(() => {
	for (let i = 0; i < bin1.length; i++) {
		bin1[i].if_is(EQUAL_TO, 1, trigger_function(() => counter(0, true).add(2 ** (15 - i))));
	}
});

let xor = (cn1, cn2) => {
	num_to_bin1.remap([0, cn1.item]).call();
	num_to_bin2.remap([0, cn2.item]).call();
	bin1.forEach((x, i) => {
		let bit_a = x;
		let bit_b = bin2[i];
		compare(bit_a, EQ, bit_b, trigger_function(() => {
			bit_a.set(0);
		}), trigger_function(() => {
			bit_a.set(1);
		}));
	});
	bin_to_num.remap([0, cn1.item]).call();
};

let and = (cn1, cn2) => {
	num_to_bin1.remap([0, cn1.item]).call();
	num_to_bin2.remap([0, cn2.item]).call();

	bin1.forEach((x, i) => {
		let stf = trigger_function(() => x.set(1));
		let ttf = trigger_function(() => {
			x.if_is(EQUAL_TO, 1, stf);
		});
		let ftf = trigger_function(() => {
			x.set(0);
		});
		compare(x, EQ, bin2[i], ttf, ftf);
	});
	bin_to_num.remap([0, cn1.item]).call();
};

let left_shift1 = (cn1, cn2) => {
	num_to_bin1.remap([0, cn1.item]).call();
	bin1.forEach((x, i) => {
		if (i == 15) {
			x.set(0);
			return;
		}
		x.set(bin1[i + 1]);
	});
	bin_to_num.remap([0, cn1.item]).call();
};

// todo: create right shift that isnt buggy + implement NOT and OR
return {
	xor, 
	and,
	left_shift1
}
