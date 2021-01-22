class TodoItem {
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

// variables
const body = document.querySelector("body");
const todoMode = document.querySelector(".todo-mode");
const todoAdd = document.querySelector(".todo-add");
const todoItemsContainer = document.querySelector(".todo-items-container");
const itemsLeft = document.querySelector(".items-left");
const clearCompletedBtn = document.querySelector(".clear-completed");
const filterBtns = document.querySelectorAll(".filter p");

console.log(filterBtns);

let todoItems = [];
let selectedFilterType = "all";

const setItemsLeftCount = () => {
	const leftItems = todoItems.filter((t) => t.isCompleted === false).length;
	itemsLeft.innerText = `${leftItems} items left`;
};

setItemsLeftCount();

// ___________________________________________________________________
// function related to theme
//set to dark mode if the system is in dark mode
if (
	window.matchMedia &&
	window.matchMedia("(prefers-color-scheme: dark)").matches
) {
	// dark mode
	console.log("dark mode");
	body.classList.add("dark");
}

// watch for change of system theme
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", (e) => {
		// const newColorScheme = e.matches ? "dark" : "light";

		console.log(e.matches);

		if (e.matches) {
			body.classList.add("dark");
		} else {
			body.classList.remove("dark");
		}
	});

todoMode.addEventListener("click", () => {
	body.classList.toggle("dark");
});
//________________________________________________________________________


//________________________________________________________________________
todoAdd.addEventListener("submit", (e) => {
	e.preventDefault();

	const todoText = todoAdd.querySelector("input");

	const todo = new TodoItem(todoText.value);
	console.log(todo);
	// makeNewTodo(todo.value, todo.createdAt);
	todoItems.push(todo);
	setItemsLeftCount();
	setTodos(getFilteredList(todoItems,selectedFilterType));
	console.log(todoItems);

	todoText.value = "";
});

// todo Item
const todoItem = (text, todoId) => {
	const div = document.createElement("div");
	div.classList.add("todo-box", "todo-item");
	div.setAttribute("data-id", todoId);

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.name = `item-${todoId}`;
	checkbox.id = `item-${todoId}`;

	checkbox.addEventListener("change", () => {
		const isCompleted = checkbox.checked;

		const todo = todoItems.find((t) => t.createdAt === todoId);
		todo.setCompleted(isCompleted);
		setItemsLeftCount();
		console.log(todo);
	});

	div.appendChild(checkbox);

	const label = document.createElement("label");
	label.classList.add("item-label");
	label.htmlFor = `item-${todoId}`;
	const textNode = document.createTextNode(text);
	label.appendChild(textNode);

	div.appendChild(label);

	const span = document.createElement("span");
	span.classList.add("checkmark");

	div.appendChild(span);

	const clearTodo = document.createElement("img");
	clearTodo.src = "./images/icon-cross.svg";
	clearTodo.classList.add("clear");

	clearTodo.addEventListener("click", (e) => {
		const clearBtn = e.target;
		console.log(clearBtn);
		// const TodoToDelete = clearBtn.closest(".todo-item");

		todoItems = todoItems.filter((t) => t.createdAt !== todoId);
		setItemsLeftCount();

		setTodos(getFilteredList(todoItems,selectedFilterType));
		// TodoToDelete.remove();
	});

	div.appendChild(clearTodo);

	return div;
};

const makeNewTodo = (todoText, todoId) => {
	todoItemsContainer.insertBefore(
		todoItem(todoText, todoId),
		todoItemsContainer.childNodes[0]
	);
};
// _________________________________________________________________________

clearCompletedBtn.addEventListener("click", () => {
	console.log("clear completed clicked");
	console.log("initial array", todoItems);
	todoItems = todoItems.filter((t) => t.isCompleted === false);
	console.log("final array", todoItems);
	setItemsLeftCount();
	setTodos(getFilteredList(todoItems,selectedFilterType));
});

const setTodos = (todoList, compareType = "default") => {
	todoItemsContainer.innerHTML = "";

	todoList = getFilteredList(todoItems,selectedFilterType);

	const compareFuncs = {
		default: (a, b) => a.createdAt - b.createdAt,
		completed: (a, b) => a.completedAt - b.completedAt,
	};

	todoList.sort(compareFuncs[compareType]);
	todoList.reverse().forEach((todo) => {
		todoItemsContainer.appendChild(todoItem(todo.value, todo.createdAt));
	});
};


filterBtns.forEach((filterBtn) => {
	filterBtn.addEventListener("click", (e) => {
		const selectedFilter = e.target;

		selectedFilter.classList.add("active");
		selectedFilterType = selectedFilter.getAttribute("data-type");
		console.log("selected filter type",selectedFilterType);

		filterBtns.forEach((f) => {
			if (f !== selectedFilter && f.classList.contains("active"))
				f.classList.remove("active");
		});

		setTodos(getFilteredList(todoItems,selectedFilterType))
	});
});

const getFilteredList = (list,filterType = "all") => {

	switch (filterType) {
		case "all":
			return list;			
		case "active":
			return list.filter(item => item.isCompleted === false);
		case "completed":
			return list.filter(item => item.isCompleted === true );
		default:
			console.log("select a valid filter type");
			break;
	}

}