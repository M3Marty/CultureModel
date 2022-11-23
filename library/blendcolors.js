
function blend(x, y, ratio) {
	return Math.round(x * ratio + y * (1 - ratio))
}

function blendColors(rgb1, rgb2, ratio) {
	return `rgb(${blend(rgb1[0], rgb2[0], ratio)}, ${blend(rgb1[1], rgb2[1], ratio)}, ${blend(rgb1[2], rgb2[2], ratio) })`
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function blendColorsHex(rgb1, rgb2, ratio) {
	return rgbToHex(blend(rgb1[0], rgb2[0], ratio), blend(rgb1[1], rgb2[1], ratio), blend(rgb1[2], rgb2[2], ratio))
}
