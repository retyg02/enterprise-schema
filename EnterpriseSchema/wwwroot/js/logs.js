const searchInput = document.getElementById("universal-search-input");

document.addEventListener("DOMContentLoaded", () => {
    
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
            //applyLiveFilter(); 
        });
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

///////////////////////////////////////////////////////////////////////////////////// lazyloading
































const pageState = {
    searchString: "",
    offset: 20,
    limit: 20,
    isLoading: false,
    hasMoreData: true
};

let logTemplateNode = null;

document.addEventListener("DOMContentLoaded", () => {
    const firstRow = document.querySelector(".logs-row");
    if (firstRow) {
        logTemplateNode = firstRow.cloneNode(true);
    } 

    initLogsInfiniteScroll();
});

function initLogsInfiniteScroll() {
    const anchor = document.getElementById("scroll-anchor");
    const loader = document.getElementById("scroll-loader");

    if (!anchor || !loader) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !pageState.isLoading && pageState.hasMoreData) {
                syncData(loader);
            }
        });
    }, {
        rootMargin: "0px 0px 200px 0px" 
    });

    observer.observe(anchor);
}

function syncData(loader) {
    if (pageState.isLoading || !pageState.hasMoreData) return;

    pageState.isLoading = true;

    if (loader) {
        loader.classList.remove("hidden");
        loader.textContent = "⏳ Загрузка новых логов...";
    }


    fetch(`?handler=LoadMore&offset=${pageState.offset}&searchString=${encodeURIComponent(pageState.searchString)}`)
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка сети: статус ${response.status}`);
            return response.json();
        })
        .then(data => {

            const container = document.getElementById("logs-main-container");
            if (!container || !logTemplateNode) return;

            if (!data || data.length === 0) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все логи загружены";

                const counterBadge = document.getElementById("universal-counter-badge");
                if (counterBadge) {
                    counterBadge.textContent = document.querySelectorAll(".logs-row").length;
                }

                return;
            }


            data.forEach((item, index) => {
                const clone = logTemplateNode.cloneNode(true);

                const userfield = clone.querySelector(".log-field-user");
                if (userfield) userfield.textContent = item.userId;

                const entityfield = clone.querySelector(".log-field-entity");
                if (entityfield) {
                    entityfield.textContent = item.entityRealName;
                    entityfield.setAttribute("title", item.entityRealName);
                }

                const actionBadge = clone.querySelector(".log-field-action");
                if (actionBadge) {
                    actionBadge.className = "log-field-action inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium";

                    if (item.actionType === "Create" || item.actionType === "Создание") {
                        actionBadge.classList.add("bg-emerald-50", "dark:bg-emerald-950/40", "text-emerald-600", "dark:text-emerald-400");
                        actionBadge.textContent = "Создание";
                    } else if (item.actionType === "Update" || item.actionType === "Изменение") {
                        actionBadge.classList.add("bg-amber-50", "dark:bg-amber-950/40", "text-amber-600", "dark:text-amber-400");
                        actionBadge.textContent = "Изменение";
                    } else if (item.actionType === "Delete" || item.actionType === "Удаление") {
                        actionBadge.classList.add("bg-red-50", "dark:bg-red-950/40", "text-red-600", "dark:text-red-400");
                        actionBadge.textContent = "Удаление";
                    } else {
                        actionBadge.textContent = item.actionType;
                    }
                }

                const descfield = clone.querySelector(".log-field-description");
                if (descfield) descfield.textContent = item.description || "—";

                const timefield = clone.querySelector(".data-copy-green-class");
                if (timefield) timefield.textContent = item.timestamp;

                container.appendChild(clone);
            });

            pageState.offset += data.length;

            if (data.length < pageState.limit) {
                pageState.hasMoreData = false;
                if (loader) {
                    loader.classList.remove("animate-pulse");
                    loader.textContent = "Все логи загружены";
                }
            }

            const counterBadge = document.getElementById("universal-counter-badge");
            if (counterBadge) {
                counterBadge.textContent = document.querySelectorAll(".logs-row").length;
            }
        })
        .catch(error => {
            if (loader) loader.textContent = "❌ Ошибка загрузки логов";
        })
        .finally(() => {
            pageState.isLoading = false;
        });
}

function applyLiveFilter() {
    const container = document.getElementById("logs-main-container");
    const loader = document.getElementById("scroll-loader");
    const searchInput = document.getElementById("universal-search-input");

    if (!container) return;

    pageState.searchString = searchInput ? searchInput.value.trim() : "";


    container.innerHTML = "";

    pageState.offset = 0;
    pageState.hasMoreData = true;
    pageState.isLoading = false;

    syncData(loader);
}

function createDebounceHandler(callback, delay = 400) {
    let timeoutId = null;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}

const handleSearchInput = createDebounceHandler(() => {
    applyLiveFilter();
});

const globalSearchInput = document.getElementById("universal-search-input");
if (globalSearchInput) {
    globalSearchInput.addEventListener("input", handleSearchInput);
}
