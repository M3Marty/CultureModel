
function Time() {
	this.timeModes = [
		{ name: 'Stop', dayDelay: false },
		{ name: 'Slow', dayDelay: 1000 },
		{ name: 'Norm', dayDelay: 400 },
		{ name: 'Fast', dayDelay: 80 },
		{ name: 'Most', dayDelay: 1 }
	]

	this.day = 0
	this.month = 0
	this.year = -5000
	this.dayStamp = 0
	this.yearDay = 0

	this.monthLength = [
		y => 31, y => !(y % 4) && (y % 100) ? 29 : 28,
		y => 31, y => 30, y => 31,
		y => 30, y => 31, y => 31,
		y => 30, y => 31, y => 30,
		y => 31
	]

	this.currentMonthLength = this.monthLength[this.month](this.year)
	this.currentYearLength = 12

	addEventListener('keypress', e => {
		if (e.keyCode >= 49 && e.keyCode <= 53) {
			e.preventDefault()
			this.setSpeed(e.keyCode - 49)
		}
		else if (e.key == ' ') {
			e.preventDefault()
			this.setSpeed(0)
		}
	})

	this.setSpeed = (id) => {
		const speed = this.timeModes[id]
		const timeView = document.getElementById('Date-View')

		this.selectedModButton.className = 'button material-icons'
		this.selectedModButton = document.getElementById(speed.name)
		this.selectedModButton.className = 'button button-selected material-icons'

		if (this.loop) {
			clearInterval(this.loop)
			this.loop = null
		}

		if (speed.dayDelay) {
			this.loop = setInterval(() => {
				this.dayStamp++
				this.yearDay++
				this.day++
				if (this.day >= this.currentMonthLength) {
					this.month++
					this.day = 0
					if (this.month >= this.currentYearLength) {
						this.year++
						this.month = 0
						this.yearDay = 0

						for (let i = 0; i < this.yearlyUpdates.length; i++) {
							this.yearlyUpdates[i].apply()
						}
					}

					this.currentMonthLength = this.monthLength[this.month](this.year)
					if (speed.dayDelay == 1) {
						timeView.innerHTML = `XX.${this.month + 1}.${this.year < 0 ? `${-this.year} BC` : `${this.year + 1} AC`}`

						for (let i = 0; i < this.renderUpdates.length; i++) {
							this.renderUpdates[i].apply()
						}
					}

					for (let i = 0; i < this.monthlyUpdates.length; i++) {
						this.monthlyUpdates[i].apply()
					}
				}
				if (speed.dayDelay - 1) {
					timeView.innerHTML = `${this.day + 1}.${this.month + 1}.${this.year < 0 ? `${-this.year} BC` : `${this.year + 1} AC`}`

					for (let i = 0; i < this.renderUpdates.length; i++) {
						this.renderUpdates[i].apply()
					}
				}

				for (let i = 0; i < this.dailyUpdates.length; i++) {
					this.dailyUpdates[i].apply()
				}

				for (let i = 0; i < this.timerUpdates.length; i++) {
					const tUpdate = this.timerUpdates[i]

					tUpdate.timer--
					if (!tUpdate.timer) {
						tUpdate.update()
						this.timerUpdates.removeTimer(i)
					}
				}
			}, speed.dayDelay - 1)
		}
	}

	this.dailyUpdates = []
	this.monthlyUpdates = []
	this.yearlyUpdates = []

	this.renderUpdates = []

	this.timerUpdates = []

	this.timerUpdates.allocated = []

	this.timerUpdates.pushTimer = (update, timer) => {
		const updateObj = { update: update, timer: timer }

		if (this.timerUpdates.allocated.length)
			this.timerUpdates[this.timerUpdates.allocated.pop()] = updateObj
		else
			this.timerUpdates.push(updateObj)
	}

	this.timerUpdates.removeTimer = i => {
		this.timerUpdates[i].update = null
		this.timerUpdates[i].timer = -1
		this.timerUpdates.allocated.push(i)
	}

	this.selectedModButton = document.getElementById('Stop')
	this.selectedModButton.className = 'button button-selected material-icons'
}
