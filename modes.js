
function MapModes() {

	this.modes = [
		{ name: 'Terrain', hotkey: 'q', mode: new TerrainMapMode() },
		{ name: 'Politic', hotkey: 'w', mode: new TerrainMapMode() },
		{ name: 'Population', hotkey: 'e', mode: new TerrainMapMode() },
		{ name: 'Production', hotkey: 'r', mode: new TerrainMapMode() },
		{ name: 'Trade', hotkey: 't', mode: new TerrainMapMode() },
		{ name: 'Resource', hotkey: 'y', mode: new TerrainMapMode() },
		{ name: 'Agriculture', hotkey: 'Q', mode: new TerrainMapMode() },
		{ name: 'Military', hotkey: 'W', mode: new TerrainMapMode() },
		{ name: 'Diplomatic', hotkey: 'E', mode: new TerrainMapMode() },
		{ name: 'Culture', hotkey: 'R', mode: new TerrainMapMode() },
		{ name: 'Religion', hotkey: 'T', mode: new TerrainMapMode() },

		{ name: 'AdminControl', hotkey: 'a', mode: new TerrainMapMode() },
		{ name: 'Groundwork', hotkey: 's', mode: new TerrainMapMode() },
		{ name: 'Cities', hotkey: 'd', mode: new TerrainMapMode() },
		{ name: 'Buildings', hotkey: 'f', mode: new TerrainMapMode() },
		{ name: 'IdeaSpread', hotkey: 'g', mode: new TerrainMapMode() },
		{ name: 'Technology', hotkey: 'h', mode: new TerrainMapMode() },
		{ name: 'Fertilized', hotkey: 'A', mode: new TerrainMapMode() },
		{ name: 'Government', hotkey: 'S', mode: new TerrainMapMode() },
		{ name: 'Climate', hotkey: 'D', mode: new ClimateMapMode() },
		{ name: 'Temperature', hotkey: 'F', mode: new TemperatureMapMode() },
		{ name: 'Overseas', hotkey: 'G', mode: new SeaMapMode() },

		{ name: 'InternOrg', hotkey: 'z', mode: new TerrainMapMode() },
		{ name: 'Sphere', hotkey: 'x', mode: new TerrainMapMode() },
		{ name: 'Person', hotkey: 'c', mode: new TerrainMapMode() },
		{ name: 'Provinces', hotkey: 'v', mode: new TerrainMapMode() },
		{ name: 'Space', hotkey: 'b', mode: new TerrainMapMode() },
		{ name: 'PipesNAll', hotkey: 'n', mode: new TerrainMapMode() },
		{ name: 'Pollution', hotkey: 'Z', mode: new TerrainMapMode() },
		{ name: 'SocStruct', hotkey: 'X', mode: new TerrainMapMode() },
		{ name: 'Tourism', hotkey: 'C', mode: new TerrainMapMode() },
		{ name: 'Immigrant', hotkey: 'V', mode: new TerrainMapMode() },
		{ name: 'Epidemic', hotkey: 'B', mode: new TerrainMapMode() }
	]

	addEventListener('keypress', e => {
		for (let i = 0; i < this.modes.length; i++)
			if (this.modes[i].hotkey == e.key) {
				e.preventDefault()
				this.setMode(i)
				return
			}
	})

	this.updater = {
		func: () => { },
		apply: () => this.updater.func.apply(true)
	}

	time.renderUpdates.push(this.updater)

	this.setMode = (id) => {
		if (this.mode.mode.reduce)
			this.mode.mode.reduce()

		this.additional.style.display = 'none'
		this.additional.innerHTML = '<h2>Map Modes</h2>'

		this.selectable.style.display = 'none'
		this.selectable.innerHTML = '<h2>Selectable Elements</h2>'

		this.selectedModButton.className = 'button material-icons'
		this.selectedModButton = document.getElementById(this.modes[id].name)
		this.selectedModButton.className = 'button button-selected material-icons'
		
		this.mode = this.modes[id]
		this.mode.mode.apply()
		this.updater.func = this.mode.mode

		if (this.mode.mode.additionalModes) {
			this.additional.style.display = 'flex'
			const span = document.createElement('span')
			span.className = 'button-field'

			this.additionalModesCurrent = document.getElementById(this.mode.name).cloneNode()
			this.additionalModesCurrent.innerHTML = document.getElementById(this.mode.name).innerHTML
			this.additionalModesCurrent.id += '-Additional'

			span.appendChild(this.additionalModesCurrent)

			for (let i = 0; i < this.mode.mode.additionalModes.length; i++) {
				const additionalMode = this.mode.mode.additionalModes[i]
				const modeButton = document.createElement('span')
				modeButton.style.marginLeft = '5px'

				modeButton.id = additionalMode.name
				modeButton.innerHTML = additionalMode.googleIcon
				modeButton.onclick = () => {
					this.additionalModesCurrent.className = 'button material-icons'
					this.additionalModesCurrent = modeButton
					this.additionalModesCurrent.className = 'button button-selected material-icons'
					this.mode.mode.apply()
					this.updater.func = additionalMode
					additionalMode.apply()
				}
				modeButton.className = 'button material-icons-outlined'

				span.appendChild(modeButton)
			}

			this.additional.appendChild(span)
		}

		if (this.mode.mode.getSelectableElements || this.mode.mode.selectableElements) {
			const selectableElements = this.mode.mode.selectableElements ? this.mode.mode.selectableElements : this.mode.mode.getSelectableElements()
			this.selectable.style.display = 'flex'

			for (let i = 0; i < selectableElements.length; i++) {
				const div = document.createElement('div')

				div.selectableElement = selectableElements[i]
				div.innerHTML = div.selectableElement.name

				div.className = 'button'
				div.onclick = () => {
					div.className = 'button selected-button'
					if (this.selectedSelectable) {
						this.selectedSelectable.className = 'button'
					}

					this.selectedSelectable = div
					this.mode.mode.apply()
					div.selectableElement.apply()
				}

				this.selectable.appendChild(div)
			}
		}
	}

	this.selectedModButton = document.getElementById('Terrain')
	this.selectedModButton.className = 'button button-selected material-icons'
	this.mode = this.modes[0] 

	this.additional = document.getElementById('Additional-Map-Modes')
	this.additional.style.display = 'none'

	this.selectable = document.getElementById('Selectable-Elements')
	this.selectable.style.display = 'none'
}
