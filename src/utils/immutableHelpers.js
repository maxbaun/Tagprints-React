export function shuffle(list) {
	const shuffled = list.withMutations(mutableList => {
		let currentItem = mutableList.size;
		let tmp = null;
		let swappedItem = null;
		while (currentItem) {
			// Pick a remaining element…
			swappedItem = Math.floor(Math.random() * currentItem--);
			// Swap with current element
			tmp = mutableList.get(currentItem);
			mutableList.set(currentItem, mutableList.get(swappedItem));
			mutableList.set(swappedItem, tmp);
		}
	});

	return shuffled;
}
