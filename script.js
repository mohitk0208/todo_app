const body = document.querySelector("body");
const todoMode = document.querySelector(".todo-mode");
const todoAdd = document.querySelector(".todo-add");
const todoItemsContainer = document.querySelector(".todo-items-container");

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

todoAdd.addEventListener("submit", (e) => {
	e.preventDefault();

	const todoText = todoAdd.querySelector("input");

	makeNewTodo(todoText.value);


	todoText.value = "";
});

const todoItem = (text) => {

	const div = document.createElement("div");
	div.classList.add("todo-box","todo-item");
	
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.name = "item-1";
	checkbox.id = "item-1";

	div.appendChild(checkbox);

	const label = document.createElement("label");
	label.classList.add("item-label");
	label.htmlFor = "item-1";
	const textNode = document.createTextNode(text);
	label.appendChild(textNode);
	
	div.appendChild(label);

	const span = document.createElement("span");
	span.classList.add("checkmark");

	div.appendChild(span);

	const img = document.createElement("img");
	img.src = "./images/icon-cross.svg"
	img.classList.add("clear")

	img.addEventListener("click",(e) => {

		const clearBtn = e.target;
		console.log(clearBtn);
		const TodoToDelete = clearBtn.closest(".todo-item");

		TodoToDelete.remove();

	})

	div.appendChild(img);

	return div;

}


const makeNewTodo = (todoText) => {

	todoItemsContainer.insertBefore(todoItem(todoText), todoItemsContainer.childNodes[0]);
};
