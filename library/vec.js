
function Vector(x = 0, y = null) {
	if (y == null)
		y = x

	this.x = x
	this.y = y

	this.len = () => {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
	}

	this.normal = () => {
		let len = this.len()
		return new Vector(this.x / len, this.y / len)
	}

	this.getCosTo = v => {
		let nA = this.normal()
		let nB = v.normal()

		let dotProduct = nA.x * nB.x + nA.y * nB.y
		return dotProduct
	}

	this.mul = x => {
		if (Number.isFinite(x))
			return new Vector(this.x * x, this.y * y)
		else
			return this.getCosTo(x)
	}

	this.add = x => {
		if (Number.isFinite(x))
			return new Vector(this.x + x, this.y + x)
		else
			return new Vector(this.x + x.x, this.y + y.x)
	}
}

const ROOT2_DIV2 = Math.sqrt(2) / 2

const DIRECTION_VECTOR = {
	top: new Vector(0, -1),
	left: new Vector(-1, 0),
	bottom: new Vector(0, 1),
	right: new Vector(1, 0),
	top_prev: new Vector(-ROOT2_DIV2, -ROOT2_DIV2),
	top_next: new Vector(ROOT2_DIV2, -ROOT2_DIV2),
	bottom_prev: new Vector(-ROOT2_DIV2, ROOT2_DIV2),
	bottom_next: new Vector(ROOT2_DIV2, ROOT2_DIV2)
}
