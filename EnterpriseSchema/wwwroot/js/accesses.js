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
            applyAccessesFilter(); 
        });
    }

    function applyAccessesFilter() {
        if (!searchInput || allRows.length === 0) return;

        const searchText = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        allRows.forEach(row => {
            const typeText = row.querySelector(".log-field-action")?.textContent.toLowerCase() || "";
            const socketText = row.querySelector(".log-field-phone")?.textContent.toLowerCase() || "";
            const userText = row.querySelector(".log-field-user")?.textContent.toLowerCase() || "";
            const descText = row.querySelector(".log-field-description")?.textContent.toLowerCase() || "";

            const enterpriseText = row.querySelector(".log-field-enterprise")?.textContent.toLowerCase() || "";

            const matchesSearch =
                typeText.includes(searchText) ||
                socketText.includes(searchText) ||
                userText.includes(searchText) ||
                descText.includes(searchText) ||
                enterpriseText.includes(searchText);

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























let currentAccessSortField = "none";
let currentAccessSortDir = "none";
let initialAccessRowsOrder = null;

function sortAccesses(field) {

    const tableBody = document.getElementById("logs-main-container");
    if (!tableBody) {
        return;
    }

    const currentRows = Array.from(tableBody.querySelectorAll(".logs-row"));

    if (currentRows.length === 0) return;

    if (!initialAccessRowsOrder) {
        initialAccessRowsOrder = [...currentRows];
    }

    if (currentAccessSortField === field) {
        if (currentAccessSortDir === "asc") {
            currentAccessSortDir = "desc";
        } else if (currentAccessSortDir === "desc") {
            currentAccessSortDir = "none";
            currentAccessSortField = "none";
        } else {
            currentAccessSortDir = "asc";
        }
    } else {
        currentAccessSortField = field;
        currentAccessSortDir = "asc";
    }

    let sortedArray = [];

    if (currentAccessSortDir === "none" || currentAccessSortField === "none") {
        sortedArray = initialAccessRowsOrder;
    } else {
        sortedArray = [...currentRows].sort((rowA, rowB) => {
            const valA = rowA.querySelector(".log-field-action")?.textContent.trim().toLowerCase() || "";
            const valB = rowB.querySelector(".log-field-action")?.textContent.trim().toLowerCase() || "";

            return currentAccessSortDir === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        });
    }

    sortedArray.forEach(row => tableBody.appendChild(row));

    updateAccessSortUI();
}

function updateAccessSortUI() {
    const btn = document.getElementById("accesses-sort-type");
    if (!btn) return;

    const svg = btn.querySelector(".sort-arrow-icon");

    if (currentAccessSortField === "type" && currentAccessSortDir !== "none") {
        btn.classList.add("text-indigo-600", "dark:text-indigo-400");
        if (svg) {
            svg.classList.remove("text-slate-300", "dark:text-slate-600");
            svg.classList.add("text-indigo-500", "dark:text-indigo-400");

            if (currentAccessSortDir === "desc") {
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
    const sortBtn = e.target.closest(".js-btn-access-sort");
    if (!sortBtn) return;

    e.preventDefault();
    const field = sortBtn.getAttribute("data-sort-field");
    sortAccesses(field);
});


















function initPasswordVisibilityAndCopyToggle() {

    document.addEventListener("click", function (e) {
        const toggleBtn = e.target.closest(".js-btn-toggle-password");
        if (toggleBtn) {
            e.preventDefault();

            const rowContainer = toggleBtn.closest(".logs-row, .flex-col");
            if (!rowContainer) return;

            const passwordSpan = rowContainer.querySelector(".js-password-text");
            if (!passwordSpan) return;

            const rawPassword = passwordSpan.getAttribute("data-raw-password") || "";
            const iconOpen = toggleBtn.querySelector(".icon-eye-open");
            const iconClosed = toggleBtn.querySelector(".icon-eye-closed");

            if (passwordSpan.innerText === "••••••••") {
                passwordSpan.innerText = rawPassword;
                if (iconOpen) iconOpen.classList.add("hidden");
                if (iconClosed) iconClosed.classList.remove("hidden");
            } else {
                passwordSpan.innerText = "••••••••";
                if (iconOpen) iconOpen.classList.remove("hidden");
                if (iconClosed) iconClosed.classList.add("hidden");
            }
            return; 
        }

        const passwordSpan = e.target.closest(".js-password-text");
        if (passwordSpan) {
            e.preventDefault();

            const textToCopy = passwordSpan.getAttribute("data-raw-password");
            if (!textToCopy) {
                return;
            }

            navigator.clipboard.writeText(textToCopy.trim()).then(() => {

                passwordSpan.classList.add(
                    '!bg-emerald-500',
                    '!text-white',
                    'scale-[1.02]',
                    'shadow-sm',
                    'transition-all',
                    'duration-150'
                );

                setTimeout(() => {
                    passwordSpan.classList.remove(
                        '!bg-emerald-500',
                        '!text-white',
                        'scale-[1.02]',
                        'shadow-sm'
                    );
                }, 200);

            }).catch(err => {
                console.error("сбой:", err);
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", initPasswordVisibilityAndCopyToggle);








async function submitDeleteAccess(event, id, name) {
    if (event) event.preventDefault();


    if (!confirm(`Вы уверены, что хотите полностью удалить доступ "${name}" ?`)) {
        return;
    }

    const card = document.getElementById(`access-card-${id}`);
    if (card) {
        card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
    } else {
    }

    const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenInput ? tokenInput.value : "";

    try {
        const response = await fetch(`/EnterpriseDetails?handler=DeleteAccess&id=${id}`, {
            method: 'POST',
            headers: {
                'RequestVerificationToken': token
            }
        });

        if (response.ok) {
            window.location.reload();
        } else {
            alert('Не удалось удалить доступ. Пожалуйста, попробуйте позже.');
            
            if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
        }
    } catch (error) {
        alert('Произошла сетевая ошибка. Проверьте соединение с сервером.');
        
        if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
    }
}
