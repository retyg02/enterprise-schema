const searchInput = document.getElementById("universal-search-input");

document.addEventListener("DOMContentLoaded", () => {

    
    const kbdShortcut = document.getElementById("universal-kbd-shortcut");
    const tableContainer = document.getElementById("logs-main-container");
    const counterBadge = document.getElementById("universal-counter-badge");
    const noResultsBlock = document.getElementById("logs-no-results");


    const allRows = tableContainer ? Array.from(tableContainer.querySelectorAll(".logs-row")) : [];

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
            //applyHostsFilter();
        });
    }

    

    updateSearchUI();
});






















let currentHostSortField = "none";
let currentHostSortDir = "none";
let initialHostRowsOrder = null;

function sortHosts(field) {

    const tableBody = document.getElementById("logs-main-container");
    if (!tableBody) {
        return;
    }

    const currentRows = Array.from(tableBody.querySelectorAll(".logs-row"));

    if (currentRows.length === 0) return;

    if (!initialHostRowsOrder) {
        initialHostRowsOrder = [...currentRows];
    }

    if (currentHostSortField === field) {
        if (currentHostSortDir === "asc") {
            currentHostSortDir = "desc";
        } else if (currentHostSortDir === "desc") {
            currentHostSortDir = "none";
            currentHostSortField = "none";
        } else {
            currentHostSortDir = "asc";
        }
    } else {
        currentHostSortField = field;
        currentHostSortDir = "asc";
    }

    let sortedArray = [];

    if (currentHostSortDir === "none" || currentHostSortField === "none") {
        sortedArray = initialHostRowsOrder;
    } else {
        sortedArray = [...currentRows].sort((rowA, rowB) => {
            const valA = rowA.querySelector(".log-field-user")?.textContent.trim().toLowerCase() || "";
            const valB = rowB.querySelector(".log-field-user")?.textContent.trim().toLowerCase() || "";

            return currentHostSortDir === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        });
    }

    sortedArray.forEach(row => tableBody.appendChild(row));

    updateHostSortUI();
}

function updateHostSortUI() {
    const btn = document.getElementById("hosts-sort-server");
    if (!btn) return;

    const svg = btn.querySelector(".sort-arrow-icon");

    if (currentHostSortField === "server" && currentHostSortDir !== "none") {
        btn.classList.add("text-indigo-600", "dark:text-indigo-400");
        if (svg) {
            svg.classList.remove("text-slate-300", "dark:text-slate-600");
            svg.classList.add("text-indigo-500", "dark:text-indigo-400");

            if (currentHostSortDir === "desc") {
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
}

document.addEventListener("click", (e) => {
    const sortBtn = e.target.closest(".js-btn-host-sort");
    if (!sortBtn) return;

    e.preventDefault();
    const field = sortBtn.getAttribute("data-sort-field");
    sortHosts(field);
});


















async function submitDeleteHost(event, id, name) {
    if (event) event.preventDefault();


    if (!confirm(`Вы уверены, что хотите полностью удалить сервер "${name}" и все связанные с ним доступы?`)) {
        return;
    }

    const card = document.getElementById(`host-card-${id}`);
    if (card) {
        card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
    } else {
    }

    const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenInput ? tokenInput.value : "";

    try {
        const response = await fetch(`/EnterpriseDetails?handler=DeleteHost&id=${id}`, {
            method: 'POST',
            headers: {
                'RequestVerificationToken': token
            }
        });

        if (response.ok) {
            window.location.reload();
        } else {
            alert('Не удалось удалить сервер. Пожалуйста, попробуйте позже.');
            
            if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
        }
    } catch (error) {
        alert('Произошла сетевая ошибка. Проверьте соединение с сервером.');
        
        if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
    }
}













//////////////////////////////////////////////////////////////////////////////  lazyloading



















const pageState = {
    searchString: "",
    offset: 20, 
    limit: 20,
    isLoading: false,
    hasMoreData: true
};

let hostTemplateNode = null;

document.addEventListener("DOMContentLoaded", () => {
    const firstRow = document.querySelector("#logs-table-body > div") || document.querySelector("[id^='host-card-']");
    if (firstRow) {
        hostTemplateNode = firstRow.cloneNode(true);
    } 

    initHostsInfiniteScroll();
});

function initHostsInfiniteScroll() {
    const anchor = document.getElementById("scroll-anchor");
    const loader = document.getElementById("scroll-loader");

    if (!anchor || !loader) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !pageState.isLoading && pageState.hasMoreData) {
                syncHostsData(loader);
            }
        });
    }, {
        rootMargin: "0px 0px 200px 0px"
    });

    observer.observe(anchor);
}

function syncHostsData(loader) {
    if (pageState.isLoading || !pageState.hasMoreData) return;

    pageState.isLoading = true;

    if (loader) {
        loader.classList.remove("hidden");
        loader.textContent = "⏳ Загрузка хостов...";
    }


    fetch(`?handler=LoadMore&offset=${pageState.offset}&searchString=${encodeURIComponent(pageState.searchString)}`)
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка сети: статус ${response.status}`);
            return response.json();
        })
        .then(data => {

            const container = document.getElementById("logs-table-body");
            if (!container || !hostTemplateNode) return;

            if (!data || data.length === 0) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все хосты загружены";

                const counterBadge = document.getElementById("universal-counter-badge");
                if (counterBadge) {
                    counterBadge.textContent = container.children.length;
                }
                return;
            }

            data.forEach(item => {
                const clone = hostTemplateNode.cloneNode(true);

                clone.setAttribute("id", `host_card_${item.id}`);
                clone.setAttribute("id", `host-card-${item.id}`); 

                const deleteBtn = clone.querySelector("button[onclick*='submitDeleteHost']");
                if (deleteBtn) {
                    deleteBtn.setAttribute("onclick", `submitDeleteHost(event, ${item.id}, '${item.name}')`);
                }

                const userField = clone.querySelector(".log-field-user");
                if (userField) userField.textContent = item.name;

                const purposeField = clone.querySelector(".log-field-purpose");
                if (purposeField) purposeField.textContent = `Назначение: ${item.purpose || ""}`;

                const phoneField = clone.querySelector(".log-field-phone");
                if (phoneField) phoneField.textContent = item.ip;

                const osNameField = clone.querySelector(".log-field-os-name");
                if (osNameField) osNameField.textContent = item.osName;

                const osVerField = clone.querySelector(".log-field-os-ver");
                if (osVerField) osVerField.textContent = `v.${item.osVer}`;

                const osTypeField = clone.querySelector(".log-field-os-type");
                if (osTypeField) osTypeField.textContent = `build.${item.osType}`;

                const descField = clone.querySelector(".log-field-description");
                if (descField) {
                    descField.textContent = item.notes;
                    descField.setAttribute("title", item.notes || "");
                }

                const enterpriseField = clone.querySelector(".log-field-entity");
                if (enterpriseField) enterpriseField.textContent = item.enterpriseName + ' (изменить &rarr;)';

                const entLink = clone.querySelector("a[href*='/EnterpriseDetails']");
                if (entLink) {
                    entLink.href = `/EnterpriseDetails?id=${item.enterpriseId}`;
                }

                const timeField = clone.querySelector(".data-copy-green-class:last-child");
                if (timeField) timeField.textContent = item.createdAt;

                container.appendChild(clone);
            });

            pageState.offset += data.length;

            if (data.length < pageState.limit) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все хосты загружены";
            }

            const counterBadge = document.getElementById("universal-counter-badge");
            if (counterBadge) {
                counterBadge.textContent = container.children.length;
            }
        })
        .catch(error => {
            if (loader) loader.textContent = "❌ Ошибка загрузки";
        })
        .finally(() => {
            pageState.isLoading = false;
        });
}

function applyLiveFilter() {
    const container = document.getElementById("logs-table-body");
    const loader = document.getElementById("scroll-loader");
    const searchInput = document.getElementById("universal-search-input");

    if (!container) return;

    pageState.searchString = searchInput ? searchInput.value.trim() : "";

    container.innerHTML = "";
    pageState.offset = 0;
    pageState.hasMoreData = true;
    pageState.isLoading = false;

    syncHostsData(loader);
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
