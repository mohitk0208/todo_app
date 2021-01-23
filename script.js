import TodoItem from "./TodoItem.js";
// import {read,add} from "./indexedDb.js";
import {
	addTodo,
	getAllTodos,
	updateTodo,
	deleteTodo,
	deleteMany,
} from "./indexedDb2.js";

if(navigator.serviceWorker) {
	window.addEventListener("load",() => {
		navigator.serviceWorker
		.register("./sw_cache_site.js")
		.then(reg => console.log("Service Worker registered"))
		.catch(err => console.error(`Service Worker: Error ${err}`));
	})
}

// addTodo(new TodoItem("different stuff"));

// (async () => {
// 	console.log(await getTodo(1611399882127));
// })();

// (async () => {
// 	console.log(await getAllTodos());
// })();

// updateTodo(1611401092656,true,new Date().getTime())

// deleteTodo(1611402374153);

const body = document.querySelector("body");
const todoMode = document.querySelector(".todo-mode");
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
// DOM Elements
const todoAdd = document.querySelector(".todo-add");
const todoItemsContainer = document.querySelector(".todo-items-container");
const itemsLeft = document.querySelector(".items-left");
const clearCompletedBtn = document.querySelector(".clear-completed");
const filterBtns = document.querySelectorAll(".filter p");

console.log(filterBtns);

// variables
// let todoItems = [];
let selectedFilterType = "all";
// (async () => {
// 	todoItems = await getAllTodos();
// console.log(todoItems);
// })();
// ________________________________________________________________________

// _________________________________________________________________________
// functions

const setItemsLeftCount = async () => {
	// const leftItems = todoItems.filter((t) => t.isCompleted === false).length;
	const leftItems = getFilteredList(await getAllTodos(), "active").length;
	itemsLeft.innerText = `${leftItems} items left`;
};

const todoItem = ({
	value: text,
	createdAt: todoId,
	isCompleted: isCompleteStatus,
}) => {
	//__________DIV_______________________
	const div = document.createElement("div");
	div.classList.add("todo-box", "todo-item");
	div.setAttribute("data-id", todoId);

	//_______________CHECKBOX____________________
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.name = `item-${todoId}`;
	checkbox.id = `item-${todoId}`;
	checkbox.checked = isCompleteStatus;

	checkbox.addEventListener("change", async () => {
		const isCompleted = checkbox.checked;

		// const todo = todoItems.find((t) => t.createdAt === todoId);
		await updateTodo(
			todoId,
			isCompleted,
			isCompleted ? new Date().getTime() : 0
		);
		// todo.setCompleted(isCompleted);
		setItemsLeftCount();
		// console.log(todo);
	});

	div.appendChild(checkbox);

	//_______________________LABEL___________________
	const label = document.createElement("label");
	label.classList.add("item-label");
	label.htmlFor = `item-${todoId}`;
	const textNode = document.createTextNode(text);
	label.appendChild(textNode);

	div.appendChild(label);

	//___________________SPAN___________________
	const span = document.createElement("span");
	span.classList.add("checkmark");

	div.appendChild(span);

	//__________________CLEARTODO____________________
	const clearTodo = document.createElement("img");
	clearTodo.src = "./images/icon-cross.svg";
	clearTodo.classList.add("clear");

	clearTodo.addEventListener("click",async (e) => {
		const clearBtn = e.target;
		console.log(clearBtn);
		// const TodoToDelete = clearBtn.closest(".todo-item");

		// todoItems = todoItems.filter((t) => t.createdAt !== todoId);
		await deleteTodo(todoId);
		setItemsLeftCount();

		setTodos();
		// TodoToDelete.remove();
	});

	div.appendChild(clearTodo);

	return div;
};

const getFilteredList = (list, filterType = "all") => {
	switch (filterType) {
		case "all":
			return list;
		case "active":
			return list.filter((item) => item.isCompleted === false);
		case "completed":
			return list.filter((item) => item.isCompleted === true);
		default:
			console.log("select a valid filter type");
			break;
	}
};

const setTodos = async () => {
	todoItemsContainer.innerHTML = "";

	let compareType = "default";

	let todoList = getFilteredList(await getAllTodos(), selectedFilterType);
	if (selectedFilterType === "completed") compareType = "completed";

	const compareFuncs = {
		default: (a, b) => a.createdAt - b.createdAt,
		completed: (a, b) => a.completedAt - b.completedAt,
	};

	todoList.sort(compareFuncs[compareType]);
	todoList.reverse().forEach((todo) => {
		todoItemsContainer.appendChild(todoItem(todo));
	});
};

setTodos();
// __________________________________________________________________________

setItemsLeftCount();

// _____________________________________________________________________
// event listeners

todoAdd.addEventListener("submit", (e) => {
	e.preventDefault();

	const todoText = todoAdd.querySelector("input");

	const todo = new TodoItem(todoText.value);
	console.log(todo);
	// todoItems.push(todo);
	addTodo(todo);
	setItemsLeftCount();
	setTodos();
	// console.log(todoItems);

	todoText.value = "";
});

clearCompletedBtn.addEventListener("click",async () => {
	console.log("clear completed clicked");
	// console.log("initial array", todoItems);
	// todoItems = todoItems.filter((t) => t.isCompleted === false);
	let itemsToDelete = (await getAllTodos()).filter(t => t.isCompleted === true).map(t => t.createdAt);
	deleteMany(itemsToDelete);
	// console.log("final array", todoItems);
	setItemsLeftCount();
	setTodos();
});

filterBtns.forEach((filterBtn) => {
	filterBtn.addEventListener("click", (e) => {
		const selectedFilter = e.target;

		selectedFilter.classList.add("active");
		selectedFilterType = selectedFilter.getAttribute("data-type");
		console.log("selected filter type", selectedFilterType);

		filterBtns.forEach((f) => {
			if (f !== selectedFilter && f.classList.contains("active"))
				f.classList.remove("active");
		});

		setTodos();
	});
});
// _______________________________________________________________________
