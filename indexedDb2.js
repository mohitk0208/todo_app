export async function addTodo(todo) {
	let db = await idb.openDB("todoDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			var objStore = db.createObjectStore("todos", { keyPath: "createdAt" });
		},
	});

	let tx = db.transaction("todos", "readwrite");
	let store = tx.objectStore("todos");

	await store.put(todo);

	await tx.done;
	db.close();
}

export async function getTodo(todoId) {
	let db = await idb.openDB("todoDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			var objStore = db.createObjectStore("todos", { keyPath: "createdAt" });
		},
	});

	let tx = db.transaction("todos");
	let store = tx.objectStore("todos");

	let todo = await store.get(todoId);

	await tx.done;
	db.close();

	return todo;
}

export async function getAllTodos() {
	let db = await idb.openDB("todoDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			var objStore = db.createObjectStore("todos", { keyPath: "createdAt" });
		},
	});

	let tx = db.transaction("todos");
	let store = tx.objectStore("todos");

	let todo = await store.getAll();

	await tx.done;
	db.close();

	return todo;
}

export async function updateTodo(todoId, isCompleted, completedAt) {
	let db = await idb.openDB("todoDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			var objStore = db.createObjectStore("todos", { keyPath: "createdAt" });
		},
	});

	let tx = db.transaction("todos", "readwrite");
	let store = tx.objectStore("todos");

	let todo = await store.get(todoId);

	todo.isCompleted = isCompleted;
	todo.completedAt = completedAt;
	await store.put(todo);

	await tx.done;
	db.close();
}

export async function deleteTodo(todoId) {
	let db = await idb.openDB("todoDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			var objStore = db.createObjectStore("todos", { keyPath: "createdAt" });
		},
	});

	let tx = db.transaction("todos", "readwrite");
	let store = tx.objectStore("todos");

	await store.delete(todoId);

	await tx.done;
	db.close();
}

export async function deleteMany(todoIds) {
	let db = await idb.openDB("todoDb", 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			var objStore = db.createObjectStore("todos", { keyPath: "createdAt" });
		},
	});

	let tx = db.transaction("todos", "readwrite");
	let store = tx.objectStore("todos");

	await Promise.all(todoIds.map((todoId) => store.delete(todoId)));

	// await store.delete(todoId);

	await tx.done;
	db.close();
}
