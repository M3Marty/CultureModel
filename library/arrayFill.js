
function fillArray(arrOrLen, func) {
	const array = Number.isFinite(arrOrLen) ? new Array(arrOrLen) : arrOrLen;
	for (let i = 0; i < array.array.length; i++)
		array[i] = func(i)

	return array
}
