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




        ////////////////////////////////////////////////////////////////////////////// lazyloading

























const pageState = {
    searchString: "",
    offset: 20,
    limit: 20,
    isLoading: false,
    hasMoreData: true
};

let contactTemplateNode = null;

document.addEventListener("DOMContentLoaded", () => {
    const firstRow = document.querySelector("#logs-table-body > div") || document.querySelector(".contact-row");
    if (firstRow) {
        contactTemplateNode = firstRow.cloneNode(true);
    

    initContactsInfiniteScroll();
});

function initContactsInfiniteScroll() {
    const anchor = document.getElementById("scroll-anchor");
    const loader = document.getElementById("scroll-loader");

    if (!anchor || !loader) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !pageState.isLoading && pageState.hasMoreData) {
                syncContactsData(loader);
            }
        });
    }, {
        rootMargin: "0px 0px 200px 0px"
    });

    observer.observe(anchor);
}

function syncContactsData(loader) {
    if (pageState.isLoading || !pageState.hasMoreData) return;

    pageState.isLoading = true;

    if (loader) {
        loader.classList.remove("hidden");
        loader.textContent = "⏳ Загрузка контактов...";
    }


    fetch(`?handler=LoadMore&offset=${pageState.offset}&searchString=${encodeURIComponent(pageState.searchString)}`)
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
            return response.json();
        })
        .then(data => {

            const container = document.getElementById("logs-table-body");
            if (!container || !contactTemplateNode) return;

            if (!data || data.length === 0) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все контакты загружены";

                const counterBadge = document.getElementById("universal-counter-badge");
                if (counterBadge) {
                    counterBadge.textContent = container.children.length;
                }
                return;
            }

            data.forEach(item => {
                const clone = contactTemplateNode.cloneNode(true);

                const userField = clone.querySelector(".log-field-user");
                if (userField) userField.textContent = item.contactUser;

                const avatar = clone.querySelector(".bg-slate-200.dark\\:bg-slate-800 span");
                if (avatar && item.contactUser) {
                    avatar.textContent = item.contactUser.length > 2
                        ? item.contactUser.substring(0, 2).toUpperCase()
                        : "КУ";
                }

                const phoneField = clone.querySelector(".log-field-phone");
                if (phoneField) phoneField.textContent = item.contactPhone;

                const entityField = clone.querySelector(".log-field-entity");
                if (entityField) {
                    entityField.textContent = item.enterpriseName;
                    entityField.setAttribute("title", item.enterpriseName);
                }

                const entLink = clone.querySelector("a[href*='/EnterpriseDetails']");
                if (entLink) {
                    entLink.href = `/EnterpriseDetails?id=${item.id}`;
                }

                container.appendChild(clone);
            });

            pageState.offset += data.length;

            if (data.length < pageState.limit) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все контакты загружены";
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

    syncContactsData(loader);
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
