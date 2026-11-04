const searchInput = document.getElementById("universal-search-input");


document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("universal-search-input");
    const kbdShortcut = document.getElementById("universal-kbd-shortcut");
    const tableContainer = document.getElementById("logs-main-container");
    
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
            //applyLiveFilter(); 
        });
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




//////////////////////////////////////////////////////////////////// lazyloading





















const pageState = {
    searchString: "",
    offset: 20, 
    limit: 20,
    isLoading: false,
    hasMoreData: true
};

let cardTemplateNode = null;

document.addEventListener("DOMContentLoaded", () => {
    const firstRow = document.querySelector("#logs-table-body > div") || document.querySelector("[data-access-id]");
    if (firstRow) {
        cardTemplateNode = firstRow.cloneNode(true);
    } 
    initAccessesInfiniteScroll();
});

function initAccessesInfiniteScroll() {
    const anchor = document.getElementById("scroll-anchor");
    const loader = document.getElementById("scroll-loader");

    if (!anchor || !loader) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !pageState.isLoading && pageState.hasMoreData) {
                syncAccessesData(loader);
            }
        });
    }, {
        rootMargin: "0px 0px 200px 0px"
    });

    observer.observe(anchor);
}

function syncAccessesData(loader) {
    if (pageState.isLoading || !pageState.hasMoreData) return;

    pageState.isLoading = true;

    if (loader) {
        loader.classList.remove("hidden");
        loader.textContent = "⏳ Загрузка доступов...";
    }


    fetch(`?handler=LoadMore&offset=${pageState.offset}&searchString=${encodeURIComponent(pageState.searchString)}`)
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
            return response.json();
        })
        .then(data => {

            const container = document.getElementById("logs-table-body");
            if (!container || !cardTemplateNode) return;

            if (!data || data.length === 0) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все доступы загружены";

                const counterBadge = document.getElementById("universal-counter-badge");
                if (counterBadge) {
                    counterBadge.textContent = container.children.length;
                }
                return;
            }

            data.forEach(item => {
                const clone = cardTemplateNode.cloneNode(true);

                clone.setAttribute("id", `access_card_${item.id}`);
                clone.setAttribute("data-access-id", item.id);

                const hiddenEnterprise = clone.querySelector(".log-field-enterprise");
                if (hiddenEnterprise) hiddenEnterprise.textContent = item.enterpriseName;

                const deleteBtn = clone.querySelector("button[onclick*='submitDeleteAccess']");
                if (deleteBtn) {
                    deleteBtn.setAttribute("onclick", `submitDeleteAccess(event, ${item.id}, '${item.accessTypeName}')`);
                }

                const actionField = clone.querySelector(".log-field_action") || clone.querySelector(".log-field-action");
                if (actionField) actionField.textContent = item.accessTypeName;

                const phoneField = clone.querySelector(".log-field-phone");
                if (phoneField) {
                    phoneField.textContent = item.port && item.port !== 0 ? `${item.address}:${item.port}` : item.address;
                }

                const userField = clone.querySelector(".log-field-user");
                if (userField) userField.textContent = item.login;

                const passSpan = clone.querySelector(".js-password-text");
                if (passSpan) {
                    passSpan.textContent = "••••••••";
                    passSpan.setAttribute("data-raw-password", item.pass);
                    passSpan.classList.remove("bg-emerald-500", "text-white");
                }

                const togglePassBtn = clone.querySelector(".js_btn_toggle_password") || clone.querySelector(".btn-toggle-password");
                if (togglePassBtn) {
                    const openEye = togglePassBtn.querySelector(".icon-eye-open");
                    const closedEye = togglePassBtn.querySelector(".icon_eye_closed") || togglePassBtn.querySelector(".icon-eye-closed");
                    if (openEye) openEye.classList.remove("hidden");
                    if (closedEye) closedEye.classList.add("hidden");
                }

                const descField = clone.querySelector(".log-field-description");
                if (descField) {
                    descField.textContent = item.note || "—";
                    descField.setAttribute("title", item.note || "");
                }

                const entLink = clone.querySelector(".js-enterprise-link");
                if (entLink) {
                    entLink.href = `/EnterpriseDetails?id=${item.enterpriseId}`;
                    entLink.textContent = item.enterpriseName;
                }

                container.appendChild(clone);
            });

            pageState.offset += data.length;

            if (data.length < pageState.limit) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все доступы загружены";
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

    syncAccessesData(loader);
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
