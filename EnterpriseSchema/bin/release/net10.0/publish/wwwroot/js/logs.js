document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("universal-search-input");
    const kbdShortcut = document.getElementById("universal-kbd-shortcut");
    const tableContainer = document.getElementById("logs-main-container");
    const counterBadge = document.getElementById("universal-counter-badge");
    const noResultsBlock = document.getElementById("logs-no-results");


    const allRows = tableContainer ? Array.from(tableContainer.querySelectorAll(".logs-row")) : [];

    if (allRows.length > 0) {
        const firstRow = allRows[0];
    }

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.code === "KeyK" || e.key.toLowerCase() === "k" || e.key.toLowerCase() === "л")) {
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        }
    });

    function updateSearchUI() {
        if (!searchInput) return;
        const val = searchInput.value.trim();

        if (document.activeElement === searchInput || val.length > 0) {
            if (kbdShortcut) kbdShortcut.classList.add("opacity-0");
        } else {
            if (kbdShortcut) kbdShortcut.classList.remove("opacity-0");
        }
    }

    if (searchInput) {
        searchInput.addEventListener("focus", updateSearchUI);
        searchInput.addEventListener("blur", updateSearchUI);
        searchInput.addEventListener("input", () => {
            updateSearchUI();
            applyLiveFilter(); 
        });
    }

    function applyLiveFilter() {
        if (!searchInput || allRows.length === 0) return;

        const searchText = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        allRows.forEach(row => {
            const userText = row.querySelector(".log-field-user")?.textContent.toLowerCase() || "";
            const entityText = row.querySelector(".log-field-entity")?.textContent.toLowerCase() || "";
            const descText = row.querySelector(".log-field-description")?.textContent.toLowerCase() || "";
            const actionText = row.querySelector(".log-field-action")?.textContent.toLowerCase() || "";

            const matchesSearch =
                userText.includes(searchText) ||
                entityText.includes(searchText) ||
                descText.includes(searchText) ||
                actionText.includes(searchText);

            if (matchesSearch) {
                row.style.setProperty("display", "", "important"); 
                visibleCount++;
            } else {
                row.style.setProperty("display", "none", "important");
            }
        });

        if (counterBadge) {
            counterBadge.textContent = visibleCount;
        }

        if (noResultsBlock) {
            if (visibleCount === 0) {
                noResultsBlock.classList.remove("hidden");
                noResultsBlock.classList.add("flex");
            } else {
                noResultsBlock.classList.remove("flex");
                noResultsBlock.classList.add("hidden");
            }
        }
    }

    updateSearchUI();
});



















let currentSortField = "none";
let currentSortDirection = "none"; 
let initialRowsElements = null;

function sortLogs(field) {

    const tableBody = document.getElementById("logs-main-container");
    if (!tableBody) {
        return;
    }

    const currentRows = Array.from(tableBody.querySelectorAll(".logs-row"));

    if (currentRows.length === 0) {
        return;
    }

    if (!initialRowsElements) {
        initialRowsElements = [...currentRows];
    }

    if (currentSortField === field) {
        if (currentSortDirection === "asc") {
            currentSortDirection = "desc";
        } else if (currentSortDirection === "desc") {
            currentSortDirection = "none";
            currentSortField = "none";
        } else {
            currentSortDirection = "asc";
        }
    } else {
        currentSortField = field;
        currentSortDirection = "asc";
    }


    let sortedArray = [];

    if (currentSortDirection === "none" || currentSortField === "none") {
        sortedArray = initialRowsElements;
    } else {
        sortedArray = [...currentRows].sort((rowA, rowB) => {
            let valA, valB;

            if (field === "time") {
                valA = parseInt(rowA.getAttribute("data-timestamp")) || 0;
                valB = parseInt(rowB.getAttribute("data-timestamp")) || 0;

                if (valA === 0 || valB === 0) {
                }

                return currentSortDirection === "asc" ? valA - valB : valB - valA;
            }
            else if (field === "action") {
                valA = rowA.querySelector(".log-field-action")?.textContent.trim().toLowerCase() || "";
                valB = rowB.querySelector(".log-field-action")?.textContent.trim().toLowerCase() || "";

                if (!valA || !valB) {
                }
            }

            return currentSortDirection === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        });
    }


    sortedArray.forEach((row, index) => {
        tableBody.appendChild(row);
    });

    updateSortHeadersUI();
}

function updateSortHeadersUI() {
    const sortButtons = document.querySelectorAll(".js-btn-sort");

    sortButtons.forEach(btn => {
        const fieldName = btn.getAttribute("data-sort-field");
        const svg = btn.querySelector(".sort-arrow-icon");

        if (fieldName === currentSortField && currentSortDirection !== "none") {
            btn.classList.add("text-indigo-600", "dark:text-indigo-400");
            if (svg) {
                svg.classList.remove("text-slate-300", "dark:text-slate-600");
                svg.classList.add("text-indigo-500", "dark:text-indigo-400");

                if (currentSortDirection === "desc") {
                    svg.classList.add("rotate-180");
                } else {
                    svg.classList.remove("rotate-180");
                }
            }
        } else {
            btn.classList.remove("text-indigo-600", "dark:text-indigo-400");
            if (svg) {
                svg.classList.remove("text-indigo-500", "dark:text-indigo-400", "rotate-180");
                svg.classList.add("text-slate-300", "dark:text-slate-600");
            }
        }
    });
}

document.addEventListener("click", (e) => {
    const sortBtn = e.target.closest(".js-btn-sort");
    if (!sortBtn) return;

    e.preventDefault();
    const field = sortBtn.getAttribute("data-sort-field");
    sortLogs(field);
});
