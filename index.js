require('@g-js-api/g.js');

let num = counter(13);
let bin = Array(16).fill(0).map(x => counter(x));
bin.forEach((x, i) => x.display(30 * i, 60));

num.display(100, 100);

let i = counter(0);
let divisor = counter(2);
let tc = counter(0);
i.display(0, 30);
wait(1);
let n = counter(0);
let cycle = trigger_function(() => {
	// todo: fix this thing not working for more than 2 cycles
	n.display(150, 100);
	$.add(item_edit(num.item, divisor.item, n.item, ITEM, ITEM, ITEM, EQ, DIV, undefined, undefined, undefined, undefined, FLR)); // n = floor(num / 2)
	tc.set(n);
	$.add(item_edit(n.item, divisor.item, n.item, ITEM, ITEM, ITEM, EQ, MUL));
	i.to_const(range(0, 15), (v) => {
		$.add(item_edit(num.item, n.item, bin[15 - v].item, ITEM, ITEM, ITEM, EQ, SUB));
	});
	num.set(tc);
	n.reset();
	i.add(1);
});
while_loop(greater_than(num, 0), () => {
	cycle.call();
});

$.liveEditor({ info: true });
