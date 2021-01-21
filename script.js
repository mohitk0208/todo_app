const body = document.querySelector("body");
const todoMode = document.querySelector(".todo-mode");
const todoAdd = document.querySelector(".todo-add");

//set to dark mode if the system is in dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // dark mode
    console.log("dark mode");
    body.classList.add("dark")
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


todoAdd.addEventListener("submit",(e) => {
	alert("submit");
})