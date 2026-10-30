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
            applyContactsFilter(); 
        });
    }

    function applyContactsFilter() {
        if (!searchInput || allRows.length === 0) return;

        const searchText = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        allRows.forEach(row => {
            const nameText = row.querySelector(".log-field-user")?.textContent.toLowerCase() || "";
            const phoneText = row.querySelector(".log-field-phone")?.textContent.toLowerCase() || "";
            const entityText = row.querySelector(".log-field-entity")?.textContent.toLowerCase() || "";

            const matchesSearch =
                nameText.includes(searchText) ||
                phoneText.includes(searchText) ||
                entityText.includes(searchText);

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
