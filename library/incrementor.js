
function Incrementor(startValue = 0) {
	this.value = startValue

	this.get = () => {
		return this.value++
	}
}
