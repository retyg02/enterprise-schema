document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("universal-search-input");
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
            applyHostsFilter();
        });
    }

    function applyHostsFilter() {
        if (!searchInput || allRows.length === 0) return;

        const searchText = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        allRows.forEach(row => {
            const serverName = row.querySelector(".log-field-user")?.textContent.toLowerCase() || "";
            const serverPurpose = row.querySelector(".log-field-purpose")?.textContent.toLowerCase() || "";
            const serverIp = row.querySelector(".log-field-phone")?.textContent.toLowerCase() || "";

            const osName = row.querySelector(".log-field-os-name")?.textContent.toLowerCase() || "";
            const osVer = row.querySelector(".log-field-os-ver")?.textContent.toLowerCase() || "";
            const osType = row.querySelector(".log-field-os-type")?.textContent.toLowerCase() || "";

            const serverNote = row.querySelector(".log-field-description")?.textContent.toLowerCase() || "";
            const enterpriseName = row.querySelector(".log-field-entity")?.textContent.toLowerCase() || "";

            const matchesSearch =
                serverName.includes(searchText) ||
                serverPurpose.includes(searchText) ||
                serverIp.includes(searchText) ||
                osName.includes(searchText) ||
                osVer.includes(searchText) ||
                osType.includes(searchText) ||
                serverNote.includes(searchText) ||
                enterpriseName.includes(searchText);

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
        console.log("Порядок хостов сброшен в исходный.");
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
