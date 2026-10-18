document.addEventListener("DOMContentLoaded", function () {
    const isDark = document.body.classList.contains("dark-mode");
    updateToggleUI(isDark);
});

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle("dark-mode");

    localStorage.setItem("theme_mode", isDark ? "dark" : "light");

    updateToggleUI(isDark);
}

function updateToggleUI(isDark) {
    const btn = document.getElementById("theme-toggle-btn");
    const ball = document.getElementById("theme-toggle-ball");
    if (!btn || !ball) return;

    if (isDark) {
        btn.classList.remove("bg-gray-200");
        btn.classList.add("bg-indigo-500");
        ball.classList.remove("translate-x-0");
        ball.classList.add("translate-x-5");
        ball.textContent = "🌙";
    } else {
        btn.classList.remove("bg-indigo-500");
        btn.classList.add("bg-gray-200");
        ball.classList.remove("translate-x-5");
        ball.classList.add("translate-x-0");
        ball.textContent = "☀️";
    }
}
