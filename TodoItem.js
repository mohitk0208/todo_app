export default class TodoItem {
	constructor(text) {
		this.createdAt = new Date().getTime();
		this.value = text;
		this.isCompleted = false;
		this.completedAt = 0;
	}

	setCompleted(checked) {
		if (checked) {
			this.isCompleted = true;
			this.completedAt = new Date().getTime();
		} else {
			this.isCompleted = false;
			this.completedAt = 0;
		}
	}
}