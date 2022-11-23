
function TemperatureMapMode() {

	this.isDymamic = true

	this.colorsList = []
	for (let i = 0; i < 111; i++) {
		const temperature = i - 50
		if (temperature > 15)
			this.colorsList.push(blendColorsHex([255, 0, 0], [255, 255, 0], (temperature - 15) / 45))
		else if (temperature > 5)
			this.colorsList.push(blendColorsHex([255, 255, 0], [0, 196, 0], (temperature - 5) / 15))
		else if (temperature > 0)
			this.colorsList.push(blendColorsHex([0, 196, 0], [0, 196, 255], (temperature) / 5))
		else
			this.colorsList.push(blendColorsHex([0, 196, 255], [0, 0, 255], (temperature + 50) / 50))
	}

	this.apply = () => {
		const season = time.yearDay / 365
		for (let i = 0; i < world.tiles.length; i++) {
			world.tiles[i].element.style.backgroundColor = this.colorsList[Math.max(Math.min(Math.round(world.atmosphere.getTemperature(world.tiles[i], season)) + 50, 110), 0)]
		}
	}

	this.reduce = () => {
		for (let i = 0; i < world.tiles.length; i++)
			world.tiles[i].addGap('top', 0)
	}
}
