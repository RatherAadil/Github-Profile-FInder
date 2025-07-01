themeToggleBtn = document.querySelector("#toggle-theme");
themeToggleBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    themeToggleBtn.textContent = "🌙";
  } else {
    document.body.classList.add("dark");
    themeToggleBtn.textContent = "☀️";
  }
});
