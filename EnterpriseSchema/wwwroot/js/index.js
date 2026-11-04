   function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    document.body.classList.add('overflow-hidden');
    
    setTimeout(() => {
        modal.classList.add('opacity-100');
        modal.firstElementChild.classList.remove('translate-y-full', 'md:scale-95');
    }, 10);
}

function closeModal(id, isNotModal = false) {
    const modal = document.getElementById(id);
    modal.classList.remove('opacity-100');
    modal.firstElementChild.classList.add('translate-y-full', 'md:scale-95');

    if (isNotModal) {
        document.body.classList.remove('overflow-hidden');
    }
    
    
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}


    function checkOverlayClose(event, id) {
        if (event.target.id === id) {
            closeModal(id, true);
        }
    }






    function openUpdateModal(id, name, cityId, contact, contactPhone, note) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateName').value = name;
    document.getElementById('updateCityId').value = cityId;
    document.getElementById('updateContact').value = contact;
    document.getElementById('updateContactPhone').value = contactPhone;
    document.getElementById('updateNote').value = note || '';




    const hiddenInput = document.getElementById('updateCityId');
    if (hiddenInput) {
        const container = hiddenInput.closest('.custom-select-container');
        const triggerText = container ? container.querySelector('.custom-select-text') : null;
        
        if (triggerText) {

            const currentOption = container.querySelector(`.custom-select-option[data-value="${cityId}"]`);
            
            if (currentOption) {
                
                triggerText.textContent = currentOption.textContent.trim();
                triggerText.classList.remove('text-gray-400', 'dark:text-gray-400');
            } else {
                
                triggerText.textContent = '-- Выберите город --';
                triggerText.classList.add('text-gray-400', 'dark:text-gray-400');
            }
        }
    }

    openModal('updateModal');
}



async function submitCityForm(event) {
    event.preventDefault();
    console.log(1);
    const input = document.getElementById('cityNameInput');
    const cityName = input.value.trim();
    if (!cityName) return;
    console.log(2);
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch('/Index?handler=CreateCity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify(cityName)
        });
        console.log(cityName);
        if (response.ok) {
            console.log(3);
            const data = await response.json();
            console.log(4);
            console.log(data);

            const container = document.querySelector('#main_select_container.custom-select-container');
    if (container) {
        const optionsBlock = container.querySelector('#main_select.custom-select-options');
        const hiddenInput = container.querySelector('.custom-select-value');
        const triggerText = container.querySelector('.custom-select-text');

        if (optionsBlock) {
            const newOption = document.createElement('div');
            newOption.setAttribute('data-value', data.id);
            newOption.className = "custom-select-option px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white cursor-pointer select-none transition-colors";
            newOption.textContent = data.name;

            newOption.addEventListener('click', function () {
                if (hiddenInput && triggerText) {
                    hiddenInput.value = data.id;
                    triggerText.textContent = data.name;
                    triggerText.classList.remove('text-gray-400', 'dark:text-gray-400');
                }
                optionsBlock.classList.add('hidden');
                const arrow = container.querySelector('.custom-select-arrow');
                if (arrow) arrow.classList.remove('rotate-180');
            });

            optionsBlock.appendChild(newOption);

            if (hiddenInput && triggerText) {
                hiddenInput.value = data.id;
                triggerText.textContent = data.name;
                triggerText.classList.remove('text-gray-400', 'dark:text-gray-400');
            }
        }
    }

    input.value = '';
    closeModal('cityModal');
} else {
            alert('Ошибка при добавлении города');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}


async function submitEnterpriseForm(event) {
    event.preventDefault();



    const errorSummary = document.getElementById('enterpriseErrorSummary');
    errorSummary.classList.add('hidden');
    errorSummary.innerHTML = '';

    const enterpriseData = {
        name: document.getElementById('NewEnterprise_Name').value.trim(),
        cityId: parseInt(document.getElementById('NewEnterprise_CityId').value),
        contact: document.getElementById('NewEnterprise_Contact').value.trim(),
        contactPhone: document.getElementById('NewEnterprise_ContactPhone').value.trim(),
        note: document.getElementById('NewEnterprise_Note').value.trim()
    };

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch('/Index?handler=Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify(enterpriseData)
        });

                if (response.ok) {
            window.location.reload();
        } else {
            const data = await response.json();
            if (data.errors && data.errors.length > 0) {
                errorSummary.classList.remove('hidden');
                errorSummary.innerHTML = '<ul class="list-disc pl-4 space-y-1"></ul>';
                const ul = errorSummary.querySelector('ul');
                data.errors.forEach(err => {
                    ul.innerHTML += `<li>${err}</li>`;
                });
            }
        }

    } catch (error) {
        console.error('Ошибка отправки предприятия:', error);
    }
}


async function submitUpdateForm(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('updateId').value);
    const card = document.getElementById(`enterprise-card-${id}`);
    
    //if (card) {
    //    card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
    //}

    const errorSummary = document.getElementById('editEnterpriseErrorSummary');
    errorSummary.classList.add('hidden');
    errorSummary.innerHTML = '';

    const updateData = {
        id: parseInt(document.getElementById('updateId').value),
        name: document.getElementById('updateName').value.trim(),
        cityId: parseInt(document.getElementById('updateCityId').value),
        contact: document.getElementById('updateContact').value.trim(),
        contactPhone: document.getElementById('updateContactPhone').value.trim(),
        note: document.getElementById('updateNote').value.trim()
    };

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch('/Index?handler=Update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            if (card) {
                card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
            }

            window.location.reload();
        } else {
            const data = await response.json();
            if (data.errors && data.errors.length > 0) {
                errorSummary.classList.remove('hidden');
                errorSummary.innerHTML = '<ul class="list-disc pl-4 space-y-1"></ul>';
                const ul = errorSummary.querySelector('ul');
                data.errors.forEach(err => {
                    ul.innerHTML += `<li>${err}</li>`;
                });
            }
        }
    } catch (error) {
        console.error('Ошибка при обновлении завода:', error);
    }
}



async function submitDelete(event, id, name) {
    event.preventDefault();
    
    if (!confirm(`Вы уверены, что хотите удалить предприятие "${name}" и все связанные серверы?`)) {
        return;
    }

    const card = document.getElementById(`enterprise-card-${id}`);
    if (card) {
        card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
    }

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch(`/Index?handler=Delete&id=${id}`, {
            method: 'POST',
            headers: {
                'RequestVerificationToken': token
            }
        });

        if (response.ok) {
            window.location.reload();
        } else {
            if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
            alert('Не удалось удалить предприятие.');
        }
    } catch (error) {
        if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
        console.error('Ошибка при удалении:', error);
    }
}


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////































document.addEventListener("DOMContentLoaded", function () {
    renderRecentEnterprises();
    setupEnterpriseClickHandlers();
    initCustomSelects();







    initHeaderSorting();






    const searchInput = document.getElementById('search-input');
    const noResultsMessage = document.getElementById('no-results-message');
    const counterBadge = document.getElementById('counter-badge');
    
    
});

function renderRecentEnterprises() {
    const listContainer = document.getElementById("recent-enterprises-container");
    const listTarget = document.getElementById("recent-enterprises-list");
    if (!listTarget) return;

    let recent = JSON.parse(localStorage.getItem("recent_enterprises")) || [];

    if (recent.length === 0) {
        listContainer.classList.add("hidden");
        return;
    }

    listContainer.classList.remove("hidden");
    listTarget.innerHTML = ""; 

    recent.forEach(ent => {
        const tag = document.createElement("a");
        tag.href = `/EnterpriseDetails?id=${ent.id}`;
        tag.className = "bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 px-2.5 py-1 rounded-md font-medium transition-colors border border-gray-200 hover:border-indigo-200 whitespace-nowrap";
        tag.textContent = ent.name;
        
        tag.addEventListener("click", function() {
            saveToRecent(ent.id, ent.name);
        });

        listTarget.appendChild(tag);
    });
}

function setupEnterpriseClickHandlers() {
    const openButtons = document.querySelectorAll("[data-enterprise-id]");
    openButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const id = this.getAttribute("data-enterprise-id");
            const name = this.getAttribute("data-enterprise-name");
            if (id && name) {
                saveToRecent(id, name);
            }
        });
    });
}

function saveToRecent(id, name) {
    let recent = JSON.parse(localStorage.getItem("recent_enterprises")) || [];

    recent = recent.filter(item => item.id !== id);

    recent.unshift({ id: id, name: name });

    if (recent.length > 3) {
        recent.pop();
    }

    localStorage.setItem("recent_enterprises", JSON.stringify(recent));
}





function initCustomSelects() {
    const containers = document.querySelectorAll('.custom-select-container');

    containers.forEach(container => {
        const trigger = container.querySelector('.custom-select-trigger');
        const optionsBlock = container.querySelector('.custom-select-options');
        const arrow = container.querySelector('.custom-select-arrow');
        const hiddenInput = container.querySelector('.custom-select-value');
        const triggerText = container.querySelector('.custom-select-text');
        const options = container.querySelectorAll('.custom-select-option');

        if (!trigger || !optionsBlock) return;

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            
            document.querySelectorAll('.custom-select-options').forEach(block => {
                if (block !== optionsBlock) block.classList.add('hidden');
            });
            document.querySelectorAll('.custom-select-arrow').forEach(arr => {
                if (arr !== arrow) arr.classList.remove('rotate-180');
            });

            const isHidden = optionsBlock.classList.contains('hidden');
            if (isHidden) {
                optionsBlock.classList.remove('hidden');
                arrow.classList.add('rotate-180');
            } else {
                optionsBlock.classList.add('hidden');
                arrow.classList.remove('rotate-180');
            }
        });

        options.forEach(option => {
            option.addEventListener('click', function () {
                const val = this.getAttribute('data-value');
                const text = this.textContent.trim();

                if (hiddenInput && triggerText) {
                    hiddenInput.value = val;
                    triggerText.textContent = text;
                    triggerText.classList.remove('text-gray-400', 'dark:text-gray-400');
                }

                optionsBlock.classList.add('hidden');
                arrow.classList.remove('rotate-180');
            });
        });
    });

    document.addEventListener('click', function () {
        document.querySelectorAll('.custom-select-options').forEach(block => block.classList.add('hidden'));
        document.querySelectorAll('.custom-select-arrow').forEach(arr => arr.classList.remove('rotate-180'));
    });
}

const btnGrid = document.getElementById('view-mode-grid');













































//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

let btnFavToggle = null;

let currentSortField = "date"; 
let currentSortOrder = "asc";  

document.addEventListener("DOMContentLoaded", function () {
    let currentViewMode = "grid"; 


    const sortBtnName = document.getElementById('sort-by-name');
    const sortBtnDate = document.getElementById('sort-by-date');

    const searchInput = document.getElementById('search-input');
    const hiddenCityInput = document.getElementById('Filter_CityId');
    const cityOptionsBlock = document.getElementById('filter-city-options');
    const btnList = document.getElementById('view-mode-list');
    const tableHeader = document.getElementById('enterprises-table-header');
    const counterBadge = document.getElementById('counter-badge');
    const noResultsMessage = document.getElementById('no-results-message');

    btnFavToggle = document.getElementById('filter-favorites-toggle');

    
    const gridContainer = document.getElementById('registry-items-container');

    if (!gridContainer) return; 

    function applyRegistryFilters() {
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
        
        const selectedCityId = hiddenCityInput ? hiddenCityInput.value.trim() : "";

        let visibleCount = 0;
        const wrappers = gridContainer.querySelectorAll('.enterprise-view-wrapper');

        wrappers.forEach(wrapper => {
            const card = wrapper.querySelector('.enterprise-card-item');
            const row = wrapper.querySelector('.view-list-row');
            
            const nameElem = wrapper.querySelector('.enterprise-name-text');
            const contactElem = wrapper.querySelector('.enterprise-contact-text');
            const cityElem = wrapper.querySelector('.enterprise-city-text');
            const ipElem = wrapper.querySelector('.enterprise-hosts-ips');

            const name = nameElem ? nameElem.textContent.toLowerCase() : "";
            const contact = contactElem ? contactElem.textContent.toLowerCase() : "";
            const city = cityElem ? cityElem.textContent.toLowerCase() : "";
            const ips = ipElem ? ipElem.textContent.toLowerCase() : "";

            const cardCityId = wrapper.getAttribute('data-city-id') ? wrapper.getAttribute('data-city-id').trim() : "";

            const matchesSearch = name.includes(searchText) || 
                                  contact.includes(searchText) || 
                                  city.includes(searchText) || 
                                  ips.includes(searchText);
            
            const matchesCity = (selectedCityId === "" || cardCityId === selectedCityId);

            const onlyFavorites = btnFavToggle ? btnFavToggle.classList.contains('is-active-fav') : false;
            const isCardFavorite = wrapper.getAttribute('data-is-favorite') === "true";
            const matchesFavorites = !onlyFavorites || isCardFavorite;

            if (matchesSearch && matchesCity && matchesFavorites) {

                wrapper.style.display = "block";
                visibleCount++;

                if (currentViewMode === "grid") {
                    if (card) card.style.setProperty('display', 'flex', 'important');
                    if (row) row.style.setProperty('display', 'none', 'important');
                } else {
                    if (card) card.style.setProperty('display', 'none', 'important');
                    if (row) row.style.setProperty('display', 'flex', 'important');
                }
            } else {
                wrapper.style.display = "none";
                if (card) card.style.setProperty('display', 'none', 'important');
                if (row) row.style.setProperty('display', 'none', 'important');
            }
        });


        const wrappers2 = Array.from(gridContainer.querySelectorAll('.enterprise-view-wrapper'));
        
        wrappers2.sort((a, b) => {
            let valA, valB;

            if (currentSortField === "name") {
                valA = a.querySelector('.enterprise-name-text')?.textContent.trim().toLowerCase() || "";
                valB = b.querySelector('.enterprise-name-text')?.textContent.trim().toLowerCase() || "";
                return currentSortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else if (currentSortField === "date") {
                valA = a.querySelector('.enterprise-date-value')?.getAttribute('data-timestamp') || "";
                valB = b.querySelector('.enterprise-date-value')?.getAttribute('data-timestamp') || "";
                return currentSortOrder === "asc" ? valB.localeCompare(valA) : valA.localeCompare(valB);
            }
            return 0;
        });

        wrappers2.forEach(wrapper => gridContainer.appendChild(wrapper));


        if (counterBadge) counterBadge.textContent = visibleCount;

        if (noResultsMessage) {
            if (visibleCount === 0) {
                noResultsMessage.classList.remove('hidden');
                noResultsMessage.style.setProperty('display', 'flex', 'important');
            } else {
                noResultsMessage.classList.add('hidden');
                noResultsMessage.style.setProperty('display', 'none', 'important');
            }
        }
    }


    if (searchInput) {
        //searchInput.addEventListener('input', applyRegistryFilters);
    }

    if (cityOptionsBlock) {
        const cityOptions = cityOptionsBlock.querySelectorAll('.custom-select-option');
        cityOptions.forEach(option => {
            option.addEventListener('click', function () {
                //setTimeout(applyRegistryFilters, 10);
            });
        });
    }


























    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////




    if (btnList) {
        btnList.addEventListener('click', function () {
            //document.querySelector("#enterprises-table-header").classList.remove("hidden");
            //document.querySelector("#enterprises-table-header").setAttribute("style", "display: flex !important;");
            currentViewMode = "list";
            btnList.classList.add('is-active-view');
            if (btnGrid) btnGrid.classList.remove('is-active-view');

            if (tableHeader) {
                tableHeader.classList.remove('hidden');
                tableHeader.classList.add('flex');
            }

            gridContainer.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
            gridContainer.classList.add('flex', 'flex-col');
            
            gridContainer.classList.add('is-table-mode');

            gridContainer.querySelectorAll('.enterprise-view-wrapper').forEach(wrapper => {
                const card = wrapper.querySelector('.view-card');
                const row = wrapper.querySelector('.view-list-row');
                if (card) card.style.setProperty('display', 'none', 'important');
                if (row) {
                    row.classList.remove('hidden');
                    row.style.setProperty('display', 'flex', 'important');
                }
            });

            //applyRegistryFilters();
        });
    }

    if (btnGrid) {
        
        btnGrid.addEventListener('click', function () {
            //document.querySelector("#enterprises-table-header").classList.add("hidden");
            //document.querySelector("#enterprises-table-header").setAttribute("style", "display: none !important;");
            currentViewMode = "grid";
            btnGrid.classList.add('is-active-view');
            if (btnList) btnList.classList.remove('is-active-view');

            if (tableHeader) {
                tableHeader.classList.remove('flex');
                tableHeader.classList.add('hidden');
            }

            gridContainer.classList.remove('flex', 'flex-col');
            
            gridContainer.classList.remove('is-table-mode');
            
            gridContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');

            gridContainer.querySelectorAll('.enterprise-view-wrapper').forEach(wrapper => {
                const card = wrapper.querySelector('.view-card');
                const row = wrapper.querySelector('.view-list-row');
                if (row) {
                    row.style.setProperty('display', 'none', 'important');
                    row.classList.add('hidden');
                }
                if (card) card.style.setProperty('display', 'flex', 'important');
            });

            //applyRegistryFilters();
        });
    }






















    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






























    if (btnFavToggle) {
        btnFavToggle.addEventListener('click', function () {
            btnFavToggle.classList.toggle('is-active-fav'); 
            //applyRegistryFilters(); 
        });
    }

    document.addEventListener('click', function (e) {
        const favBtn = e.target.closest('.btn-card-favorite');
        if (!favBtn) return;

        e.preventDefault();
        e.stopPropagation();

        const enterpriseId = favBtn.getAttribute('data-enterprise-id');
        const wrapper = favBtn.closest('.enterprise-view-wrapper');

        fetch(`?handler=ToggleFavorite&enterpriseId=${enterpriseId}`, {
            method: 'POST',
            headers: {
                'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value || ""
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.isFavorite) {
                    favBtn.classList.add('is-in-favorite');
                    if (wrapper) wrapper.setAttribute('data-is-favorite', 'true');
                } else {
                    favBtn.classList.remove('is-in-favorite');
                    if (wrapper) wrapper.setAttribute('data-is-favorite', 'false');
                }
                
                if (btnFavToggle && btnFavToggle.classList.contains('is-active-fav')) {
                    applyRegistryFilters();
                }
            } else {
                console.error("Ошибка сохранения избранного в аккаунт");
            }
        })
        .catch(error => console.error("Сетевая ошибка AJAX:", error));
    });

    function updateSortButtonsUI() {
        if (!sortBtnName || !sortBtnDate) return;
        [sortBtnName, sortBtnDate].forEach(btn => btn.classList.remove('is-active-sort', 'sort-desc'));

        if (currentSortField === "name") {
            sortBtnName.classList.add('is-active-sort');
            if (currentSortOrder === "desc") sortBtnName.classList.add('sort-desc');
        } else if (currentSortField === "date") {
            sortBtnDate.classList.add('is-active-sort');
            if (currentSortOrder === "desc") sortBtnDate.classList.add('sort-desc');
        }
    }

    if (sortBtnName) {
        sortBtnName.addEventListener('click', function () {
            if (currentSortField === "name") {
                currentSortOrder = (currentSortOrder === "asc") ? "desc" : "asc";
            } else {
                currentSortField = "name";
                currentSortOrder = "asc";
            }
            updateSortButtonsUI();
            //applyRegistryFilters();
        });
    }

    if (sortBtnDate) {
        sortBtnDate.addEventListener('click', function () {
            if (currentSortField === "date") {
                currentSortOrder = (currentSortOrder === "asc") ? "desc" : "asc";
            } else {
                currentSortField = "date";
                currentSortOrder = "asc";
            }
            updateSortButtonsUI();
            //applyRegistryFilters(); 
        });
    }

    updateSortButtonsUI();

});




document.addEventListener('click', function (e) {
    const favBtn = e.target.closest('.btn-card-favorite');
    if (!favBtn) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (favBtn.classList.contains('is-loading-ajax')) return;
    favBtn.classList.add('is-loading-ajax');

    const enterpriseId = favBtn.getAttribute('data-enterprise-id');
    
    let wrapper = favBtn.closest('.enterprise-view-wrapper');
    
    if (!wrapper && enterpriseId) {
        wrapper = document.querySelector(`.enterprise-view-wrapper[data-enterprise-id="${enterpriseId}"]`);
    }

    fetch(`?handler=ToggleFavorite&enterpriseId=${enterpriseId}`, {
        method: 'POST',
        headers: {
            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value || ""
        }
    })
    .then(response => response.json())
    .then(data => {
        document.querySelectorAll(`.btn-card-favorite[data-enterprise-id="${enterpriseId}"]`).forEach(btn => {
            btn.classList.remove('is-loading-ajax');
        });

        if (data.success) {
            const allButtonsOfThisEnterprise = document.querySelectorAll(`.btn-card-favorite[data-enterprise-id="${enterpriseId}"]`);

            if (data.isFavorite) {
                allButtonsOfThisEnterprise.forEach(btn => {
                    btn.classList.add('is-in-favorite');
                    const svg = btn.querySelector('svg');
                    if (svg) svg.classList.add('text-amber-500', 'fill-amber-500');
                });
                if (wrapper) wrapper.setAttribute('data-is-favorite', 'true');
            } else {
                allButtonsOfThisEnterprise.forEach(btn => {
                    btn.classList.remove('is-in-favorite');
                    const svg = btn.querySelector('svg');
                    if (svg) svg.classList.remove('text-amber-500', 'fill-amber-500');
                });
                if (wrapper) wrapper.setAttribute('data-is-favorite', 'false');
            }

            if (wrapper) {
                const sidebarSourceStar = wrapper.querySelector('.sidebar-data-source .btn-card-favorite');
                if (sidebarSourceStar) {
                    if (data.isFavorite) {
                        sidebarSourceStar.classList.add('is-in-favorite');
                    } else {
                        sidebarSourceStar.classList.remove('is-in-favorite');
                    }
                }
            }

            if (btnFavToggle && btnFavToggle.classList.contains('is-active-fav')) {
                //applyRegistryFilters();
            }
        } else {
            console.log(data);
            console.error("Ошибка сохранения избранного в аккаунт");
        }
    })
    .catch(error => {
        document.querySelectorAll(`.btn-card-favorite[data-enterprise-id="${enterpriseId}"]`).forEach(btn => {
            btn.classList.remove('is-loading-ajax');
        });
        console.error("Сетевая ошибка AJAX:", error);
    });
});






document.addEventListener('click', function (e) {
    const clickedCard = e.target.closest('[id^="enterprise-card-"]');
    if (!clickedCard) return;

    if (
        e.target.closest('a') || 
        e.target.closest('button') || 
        e.target.closest('.btn-card-favorite')
    ) {
        return;
    }

    const wrapper = clickedCard.closest('.enterprise-view-wrapper');
    if (!wrapper) return;

    const dataSource = wrapper.querySelector('.sidebar-data-source');
    if (!dataSource || !sidebar || !sidebarContent) return;

    sidebarContent.innerHTML = dataSource.innerHTML;
    sidebar.classList.add('is-open');
});






document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('enterprise-audit-sidebar');
    
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            
const togglePassBtn = e.target.closest('.btn-toggle-password');
if (togglePassBtn) {
    e.preventDefault();
    e.stopPropagation();
    
    const passContainer = togglePassBtn.closest('.access-crypto-block')?.querySelector('.password-value');
    if (passContainer) {
        const isHidden = passContainer.getAttribute('data-hidden') === 'true';
        if (isHidden) {
            const realPass = passContainer.getAttribute('data-real-password');
            passContainer.textContent = realPass;
            passContainer.setAttribute('data-hidden', 'false');
            passContainer.setAttribute('data-copy-target', realPass);
            togglePassBtn.innerHTML = `<svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" 
            stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1
            0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638
            0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
        } else {
            passContainer.textContent = '••••••••';
            passContainer.setAttribute('data-hidden', 'true');
            passContainer.setAttribute('data-copy-target', passContainer.getAttribute('data-real-password'));
            togglePassBtn.innerHTML = `<svg xmlns="http://w3.org" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
            id="eye-icon-1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478
            0-8.268-2.943-9.542-7a10.024 10.024 0 014.13-5.24M7.42 7.42L16.6 16.6M9.88 9.88a3 3 0 104.24 4.24M10.804 5.204A10.015 10.015 0 0112
            5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.24M3 3l18 18"></path></svg>`;
        }
    }
    return;
}


            const copyItem = e.target.closest('.js-clickable-copy');
            if (copyItem) {
                const textToClipboard = copyItem.getAttribute('data-copy-target');
                if (textToClipboard) {
                    navigator.clipboard.writeText(textToClipboard).then(() => {
                        copyItem.classList.add('!text-emerald', '!scale-105');
                        
                        setTimeout(() => {
                            copyItem.classList.remove('!text-emerald', '!scale-105');
                        }, 250);
                    }).catch(err => console.error('Сбой копирования:', err));
                }
            }
        });
    }
});





    const sidebar = document.getElementById('enterprise-audit-sidebar');
    const sidebarContent = document.getElementById('sidebar-dynamic-content');
    const closeSidebarBtn = document.getElementById('close-audit-sidebar');

    document.addEventListener('click', function (e) {
        const clickedRow = e.target.closest('.row-click-area');
        if (!clickedRow) return;

        if (e.target.closest('a') || e.target.closest('button')) return;

        const wrapper = clickedRow.closest('.enterprise-view-wrapper');
        if (!wrapper) return;

        const dataSource = wrapper.querySelector('.sidebar-data-source');
        if (!dataSource || !sidebar || !sidebarContent) return;

        sidebarContent.innerHTML = dataSource.innerHTML;
        sidebar.classList.add('is-open');
    });

    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', function () {
            sidebar.classList.remove('is-open');
        });
    }

    if (btnGrid) {
        btnGrid.addEventListener('click', function () {
            if (sidebar) sidebar.classList.remove('is-open');
        });
    }



  


























function openImagePreview(imageUrl) {
    const modal = document.getElementById('imagePreviewModal');
    const imgTarget = document.getElementById('previewImageTarget');
    
    if (!modal || !imgTarget) return;

    imgTarget.src = imageUrl;

    modal.style.setProperty("display", "flex", "important");
    
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
    }, 10);
}

function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    setTimeout(() => {
        modal.style.setProperty("display", "none", "important");
        document.body.style.overflow = '';
        document.getElementById('previewImageTarget').src = '';
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imagePreviewModal');
    const closeBtn = document.getElementById('closePreviewBtn');

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeImagePreview();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeImagePreview();
        });
    }
});























    //////////////////////////////////////////////////////////////// lazyloading




























if (typeof window.currentViewModel === 'undefined') {
    window.currentViewModel = "grid";
}



const pageState = {
    searchString: "",
    cityId: null,
    isFavoriteOnly: false,
    offset: 20, 
    limit: 20,
    isLoading: false,
    hasMoreData: true,
    
    sortField: "name", 
    sortOrder: "asc",  
    
    savedCardStyle: "",
    savedRowStyle: "",
    savedCardHidden: false,
    savedRowHidden: false
};

let enterpriseTemplateNode = null;

let firstRow = null;

document.addEventListener("DOMContentLoaded", () => {

    firstRow = document.querySelector("#registry-items-container > div[data-is-favorite]:has(.enterprise-note-tooltip-text)") || document.querySelector("#registry-items-container > div[data-is-favorite]");
    console.log(firstRow);
    if (firstRow) {
        enterpriseTemplateNode = firstRow.cloneNode(true);
    } 


    initIndexInfiniteScroll();
    initFilterInterceptors();
});

function initIndexInfiniteScroll() {
    const anchor = document.getElementById("scroll-anchor");
    const loader = document.getElementById("scroll-loader");

    if (!anchor || !loader) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !pageState.isLoading && pageState.hasMoreData) {
                syncData(loader);
            }
        });
    }, { rootMargin: "0px 0px 200px 0px" });

    observer.observe(anchor);
}

function syncData(loader) {
    if (pageState.isLoading || !pageState.hasMoreData) return;

    pageState.isLoading = true;
    if (loader) {
        loader.classList.remove("hidden");
        loader.textContent = "⏳ Подгрузка инфраструктуры...";
    }

    const url = `?handler=LoadMore&offset=${pageState.offset}` +
        `&searchString=${encodeURIComponent(pageState.searchString)}` +
        `&cityId=${pageState.cityId || ""}` +
        `&isFavoriteOnly=${pageState.isFavoriteOnly}` +
        `&sortField=${pageState.sortField}` +
        `&sortOrder=${pageState.sortOrder}`;


    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
            return response.json();
        })
        .then(data => {

            if (pageState.offset === 0) {
                const mainRegistryContainer = document.getElementById("registry-items-container");
                const firstLiveWrapper = document.querySelector("#registry-items-container > div[data-is-favorite]");

                //const liveHeader = document.getElementById("enterprises-table-header");

                if (firstLiveWrapper) {
                    const liveCard = firstLiveWrapper.querySelector('[id^="enterprise-card-"]');
                    const liveRow = firstLiveWrapper.querySelector('.enterprise-list-item-wrapper');

                    pageState.savedCardStyle = liveCard ? liveCard.style.cssText : "";
                    pageState.savedRowStyle = liveRow ? liveRow.style.cssText : "";

                    pageState.savedCardHidden = liveCard ? liveCard.classList.contains('hidden') : false;
                    pageState.savedRowHidden = liveRow ? liveRow.classList.contains('hidden') : false;

                }

                //if (liveHeader) {
                  //  window.savedListHeaderNode = liveHeader.cloneNode(true);
                    //console.log("[JS TRACE] Шапка списка успешно сохранена перед очисткой");
                //}

                if (mainRegistryContainer) {
                    mainRegistryContainer.innerHTML = "";
                }
            }




            if (!data || data.length === 0) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все элементы загружены";
                updateCounterBadge();
                return;
            }











            const container = document.getElementById("registry-items-container");

            data.forEach((item, idx) => {
                const clone = enterpriseTemplateNode.cloneNode(true);
                clone.setAttribute("data-enterprise-wrapper-id", item.id);
                const innerCard = clone.querySelector("[id^='enterprise-card-']");









                const startCard = clone.querySelector('.view-card') || clone.querySelector('.view-card-item') || clone.querySelector('[id^="enterprise-card-"]');
                const startRow = clone.querySelector('.view-list-row') || clone.querySelector('.enterprise-list-row-item-wrapper');






               









                clone.setAttribute("data-is-favorite", item.isFavorite ? "true" : "false");

                const starIcon = clone.querySelector("button[title='Избранное'] svg");
                if (starIcon) {
                    if (item.isFavorite) {
                        starIcon.classList.add("text-amber-500", "fill-amber-500"); 
                    } else {
                        starIcon.classList.remove("text-amber-500", "fill-amber-500");
                    }
                }
                clone.className = "enterprise-view-wrapper w-full bg-transparent border-none p-0 m-0 shadow-none";

                
                if (innerCard) {
                    innerCard.className = "cursor-pointer view-card enterprise-card-item bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-between w-full shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all ease-in-out duration-200 text-gray-900 dark:text-white"; // Восстановил твои оригинальные классы углов и ховера со скринов
                }


                innerCard.setAttribute("id", `enterprise-card-${item.id}`);
                clone.setAttribute("data-city-id", item.cityId || 0);

                const nameHeader = clone.querySelector(".enterprise-name-text span");
                if (nameHeader) {
                    nameHeader.innerHTML = item.name;
                    nameHeader.setAttribute("title", item.name);
                }













                //console.log(item);



                const favBtnCard = clone.querySelector(".btn-card-favorite");

                if (!favBtnCard) {
                    const backupFavBtn = clone.querySelector("button[title='Избранное']");
                }

                if (favBtnCard) {
                    const oldId = favBtnCard.getAttribute("data-enterprise-id");
                    favBtnCard.setAttribute("data-enterprise-id", item.id);

                    const hasClassBefore = favBtnCard.classList.contains("is-in-favorite");
                    if (item.isFavorite) {
                        favBtnCard.classList.add("is-in-favorite");
                    } else {
                        favBtnCard.classList.remove("is-in-favorite");
                    }

                }























                const cityField = clone.querySelector(".enterprise-city-text");
                if (cityField) {
                    cityField.textContent = item.cityName;
                    cityField.setAttribute("title", item.cityName);
                }
                const cityTooltip = clone.querySelector(".enterprise-city-text")?.closest(".group")?.querySelector(".rounded-lg");
                if (cityTooltip) cityTooltip.textContent = item.cityName;


                const contactField = clone.querySelector(".enterprise-contact-text");
                if (contactField) {
                    const contactValue = item.contactUser || "Не указан";
                    contactField.textContent = contactValue;
                    contactField.setAttribute("title", contactValue);
                }
                const contactTooltip = clone.querySelector(".enterprise-contact-text")?.closest(".group")?.querySelector(".rounded-lg");
                if (contactTooltip) contactTooltip.textContent = item.contactUser || "Не указан";



                const noNotesWrapper = clone.querySelector(".flex-col.justify-start.text-gray-400"); 

                const nameTooltip = clone.querySelector(".enterprise-name-tooltip");
                if (nameTooltip) {
                    nameTooltip.textContent = item.name;
                }


                const noteGroup = clone.querySelector(".enterprise-note-group");
                const noNotesPlaceholder = clone.querySelector(".enterprise-no-notes-placeholder");
                const noteTextEl = clone.querySelector(".enterprise-note-text");
                const noteTooltipText = clone.querySelector(".enterprise-note-tooltip-text");

                if (item.note && item.note.trim() !== "") {
                    if (noteGroup) noteGroup.style.display = "block";
                    if (noNotesPlaceholder) noNotesPlaceholder.style.display = "none";

                    if (noteTextEl) noteTextEl.textContent = item.note;
                    if (noteTooltipText) noteTooltipText.textContent = item.note;
                } else {
                    if (noteGroup) {
                        if (noNotesPlaceholder) {
                            noteGroup.style.display = "none";
                            noNotesPlaceholder.style.display = "block";
                        } else {
                            noteGroup.className = "flex flex-col justify-start mt-2 text-[11px] text-gray-400 dark:text-gray-600";
                            noteGroup.style.display = "block";
                            noteGroup.innerHTML = '<span class="relative top-[-5px]">Нет заметок</span>';
                        }
                    }
                }














                const editBtn = clone.querySelector("button[onclick*='openUpdateModal']");
                if (editBtn) {
                    const phone = item.contactPhone || "";
                    const note = item.note || "";
                    editBtn.setAttribute("onclick", `openUpdateModal(${item.id}, '${item.name.replace(/'/g, "\\'")}', '${item.cityId || 0}', '${item.contactUser ? item.contactUser.replace(/'/g, "\\'") : ""}', '${phone}', '${note.replace(/'/g, "\\'")}')`);
                }


                const deleteForm = clone.querySelector("form[onsubmit*='submitDelete']");
                const deleteBtnCard = clone.querySelector("button[onclick*='submitDelete']");

                if (deleteForm) {
                    deleteForm.setAttribute("onsubmit", `return submitDelete(event, ${item.id}, '${item.name.replace(/'/g, "\\'")}')`);
                }

                if (deleteBtnCard) {
                    deleteBtnCard.setAttribute("onclick", `submitDelete(event, ${item.id}, '${item.name.replace(/'/g, "\\'")}')`);

                    deleteBtnCard.setAttribute("title", `Удалить ${item.name.replace(/'/g, "\\'")}`);
                }



                const openLink = clone.querySelector("a[href*='/EnterpriseDetails']");
                if (openLink) {
                    openLink.href = `/EnterpriseDetails?id=${item.id}`;
                    
                    openLink.setAttribute("onclick", `event.preventDefault(); saveToRecent(${item.id}, '${item.name}');window.location.href = this.href;`);
                    openLink.setAttribute("data-enterprise-id", item.id);
                    openLink.setAttribute("asp-route-id", item.id);
                }









                const hostsCount = item.hostsCount || 0;
                const hostsListContainer = clone.querySelector(".enterprise-hosts-preview-list");
                const noHostsPlaceholder = clone.querySelector(".enterprise-no-hosts-placeholder");
                const totalHostsTextEl = clone.querySelector(".enterprise-hosts-total-text");
                console.log(clone.querySelector(".enterprise-hosts-total-text"));
                if (item.hostsCount > 0) {
                    if (hostsListContainer) hostsListContainer.classList.remove("hidden");
                    if (noHostsPlaceholder) noHostsPlaceholder.classList.add("hidden");

                    if (hostsListContainer && item.hostsPreview && item.hostsPreview.length > 0) {
                        hostsListContainer.innerHTML = "";

                        item.hostsPreview.forEach(hostName => {
                            const hostRow = document.createElement("div");
                            hostRow.className = "flex items-center space-x-1";
                            hostRow.innerHTML = `
                                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                <span class="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]" title="${hostName}">${hostName}</span>
                            `;
                            hostsListContainer.appendChild(hostRow);
                        });
                    }

                    if (totalHostsTextEl) {
                        let word = "серверов";
                        const remainder10 = item.hostsCount % 10;
                        const remainder100 = item.hostsCount % 100;

                        if (remainder10 === 1 && remainder100 !== 11) {
                            word = "сервер";
                        } else if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 10 || remainder100 >= 20)) {
                            word = "сервера";
                        }
                        totalHostsTextEl.textContent = `Всего: ${item.hostsCount} ${word}`;
                    }
                } else {
                    console.log(hostsCount);

                    if (hostsListContainer) hostsListContainer.classList.add("hidden");
                    //noHostsPlaceholder.classList.remove("hidden");
                    if (totalHostsTextEl) totalHostsTextEl.textContent = "Всего: 0 серверов";
                    console.log(111111);
                    console.log(totalHostsTextEl);
                    if (totalHostsTextEl) totalHostsTextEl.style.setProperty('display', 'block', 'important');
                    console.log(1111111);
                }


                const dateField = clone.querySelector(".enterprise-date-value");
                if (dateField) {
                    dateField.textContent = item.updatedAt;
                    dateField.setAttribute("data-timestamp", item.updatedAt);
                }


                const sidebarSource = clone.querySelector(".sidebar-data-source");

                if (sidebarSource) {

                    const sidebarTitle = sidebarSource.querySelector("h2");
                    if (sidebarTitle) {
                        sidebarTitle.innerHTML = item.name;
                        sidebarTitle.setAttribute("title", item.name);
                    }










                   













                    const sidebarFavBtn = sidebarSource.querySelector(".btn-card-favorite");

                    if (!sidebarFavBtn) {
                        const backupListBtn = sidebarFavBtn.querySelector("button");
                    }

                    if (sidebarFavBtn) {
                        const oldId = sidebarFavBtn.getAttribute("data-enterprise-id");
                        sidebarFavBtn.setAttribute("data-enterprise-id", item.id);

                        const hasClassBefore = sidebarFavBtn.classList.contains("is-in-favorite");
                        if (item.isFavorite) {
                            sidebarFavBtn.classList.add("is-in-favorite");
                        } else {
                            sidebarFavBtn.classList.remove("is-in-favorite");
                        }
                    }
















                    const sidebarCity = sidebarSource.querySelector("span[data-copy-green]");
                    if (sidebarCity) {
                        sidebarCity.textContent = item.cityName || "Город не указан";
                    }

                    const sidebarDetailsLink = sidebarSource.querySelector("a[href*='/EnterpriseDetails']");
                    if (sidebarDetailsLink) {
                        sidebarDetailsLink.href = `/EnterpriseDetails?id=${item.id}`;
                        sidebarDetailsLink.setAttribute("onclick", `event.preventDefault(); saveToRecent(${item.id}, '${item.name}');window.location.href = this.href;`)
                    }



                    const sidebarEditBtn = sidebarSource.querySelector("button[onclick*='openUpdateModal']");
                    if (sidebarEditBtn) {
                        const phone = item.contactPhone || "";
                        const note = item.note || "";
                        sidebarEditBtn.setAttribute("onclick", `openUpdateModal(${item.id}, '${item.name.replace(/'/g, "\\'")}', '${item.cityId}', '${item.contactUser ? item.contactUser.replace(/'/g, "\\'") : ""}', '${phone.replace(/'/g, "\\'")}', '${note.replace(/'/g, "\\'")}')`);
                    }

                    const sidebarDeleteForm = sidebarSource.querySelector("form[id^='delete-form-']") || sidebarSource.querySelector("form[onsubmit*='submitDelete']");
                    if (sidebarDeleteForm) {
                        sidebarDeleteForm.setAttribute("onsubmit", `return submitDelete(event, ${item.id}, '${item.name.replace(/'/g, "\\'")}')`);

                        const sidebarDeleteBtn = sidebarDeleteForm.querySelector("button");
                        if (sidebarDeleteBtn) {
                            sidebarDeleteBtn.setAttribute("onclick", `submitDelete(event, ${item.id}, '${item.name.replace(/'/g, "\\'")}')`);
                            sidebarDeleteBtn.setAttribute("title", `Удалить ${item.name.replace(/'/g, "\\'")}`);
                        }
                    }




                    const sidebarContactUser = sidebarSource.querySelector(".enterprise-contact-text") || sidebarSource.querySelector("p.font-medium");
                    if (sidebarContactUser) {
                        sidebarContactUser.textContent = item.contactUser || "Не указан";
                    }

                    const sidebarContactPhoneWrapper = sidebarSource.querySelector(".js-clickable-copy") || sidebarSource.querySelector("p[data-copy-target]");
                    const sidebarContactPhoneSpan = sidebarSource.querySelector("span[data-copy-green].font-mono");

                    if (item.contactPhone && item.contactPhone.trim() !== "") {
                        if (sidebarContactPhoneWrapper) {
                            sidebarContactPhoneWrapper.style.display = "flex";
                            sidebarContactPhoneWrapper.setAttribute("data-copy-target", item.contactPhone);
                        }
                        if (sidebarContactPhoneSpan) sidebarContactPhoneSpan.textContent = item.contactPhone;
                    } else {
                        if (sidebarContactPhoneWrapper) sidebarContactPhoneWrapper.style.display = "none";
                    }






































                    let sidebarHostsContainer = sidebarSource.querySelector(".sidebar-hosts-list");
                    const hostBlueprint = sidebarSource.querySelector(".js-sidebar-host-blueprint");

                    if (!sidebarHostsContainer) {
                        const infraHeader = Array.from(sidebarSource.querySelectorAll("h4")).find(h => h.textContent.includes("Инфраструктура"));
                        if (infraHeader) {
                            sidebarHostsContainer = sidebarSource.querySelector(".sidebar-no-hosts-placeholder")?.parentElement || infraHeader.nextElementSibling;

                            if (sidebarHostsContainer && !sidebarHostsContainer.classList.contains("sidebar-hosts-list")) {
                                sidebarHostsContainer.className = "sidebar-hosts-list space-y-3 mt-2";
                            }
                        }
                    }


                    if (sidebarHostsContainer && hostBlueprint) {
                        if (item.hostsCount > 0 && item.hostsFull && item.hostsFull.length > 0) {
                            //sidebarHostsContainer.style.display = "flex";
                            sidebarHostsContainer.innerHTML = "";

                            const hostTemplate = hostBlueprint.querySelector("div").cloneNode(true);

                            item.hostsFull.forEach((host, hIdx) => {
                                const hostClone = hostTemplate.cloneNode(true);

                                if (hostClone.querySelector(".js-tpl-host-name")) {

                                    hostClone.querySelector(".js-tpl-host-name").textContent = host.name;
                                    hostClone.querySelector(".js-tpl-host-name").setAttribute('data-copy-green', '')
                                }

                                const ipSpan = hostClone.querySelector(".js-tpl-host-ip");
                                if (ipSpan) {
                                    ipSpan.textContent = host.ip;
                                    ipSpan.setAttribute("data-data-copy-target", host.ip);
                                    ipSpan.setAttribute("data-copy-target", host.ip);
                                }

                                hostClone.querySelector(".js-tpl-host-os").textContent = host.osName;
                                hostClone.querySelector(".js-tpl-host-os").setAttribute('data-copy-green', '')
                                hostClone.querySelector(".js-tpl-host-ver").textContent = `v.${host.osVer}`;
                                hostClone.querySelector(".js-tpl-host-ver").setAttribute('data-copy-green', '')
                                hostClone.querySelector(".js-tpl-host-type").textContent = `x${host.osType}`;
                                hostClone.querySelector(".js-tpl-host-type").setAttribute('data-copy-green', '')
                                hostClone.querySelector(".js-tpl-host-purpose").textContent = `Назначение: ${host.purpose}`;
                                hostClone.querySelector(".js-tpl-host-purpose").setAttribute('data-copy-green', '')
































                                const accessesContainer = hostClone.querySelector(".js-tpl-accesses-container");
                                if (accessesContainer && host.accesses && host.accesses.length > 0) {
                                    accessesContainer.style.display = "flex";
                                    accessesContainer.innerHTML = "";

                                    host.accesses.forEach((acc, aIdx) => {
                                        const accRow = document.createElement("div");




                                        accRow.className = "sidebar-access-item bg-slate-50 dark:bg-slate-900 rounded-lg p-2 text-[11px] border border-slate-100 dark:border-slate-800 space-y-1";

                                        let decodedPass = acc.passEncrypted || "";
                try {
                    decodedPass = decodeURIComponent(decodedPass);
                } catch (e) {
                    console.warn("Ошибка:", e);
                }

                                        accRow.innerHTML = `
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-indigo-600 dark:text-indigo-400 uppercase text-[10px]">${acc.typeName}</span>
                                <span data-copy-target="${acc.socket}" class="js-clickable-copy font-mono text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded px-1 transition-all duration-200 cursor-pointer" title="Скопировать сокет">
                                    ${acc.socket}
                                </span>
                            </div>
                            
                            <div class="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono text-[10px] access-crypto-block">
                                <span>логин:</span>
                                <span data-copy-target="${acc.login}" class="js-clickable-copy text-slate-800 dark:text-slate-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 rounded px-1 transition-all duration-200 cursor-pointer">
                                    ${acc.login}
                                </span>
                            </div>
                            
                            <div class="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono text-[10px] access-crypto-block">
                                <span>пароль:</span>
                                <div class="flex items-center space-x-1">
                                    <span data-copy-target="${decodedPass}" data-real-password="${decodedPass}" data-hidden="true" class="js-clickable-copy password-value text-slate-800 dark:text-slate-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 rounded px-1 transition-all duration-200 cursor-pointer">
                                        ••••••••
                                    </span>
                                    <button type="button" class="btn-toggle-password p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors duration-200" title="Показать/скрыть пароль">
                                        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 svg-eye-icon">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="sidebar-files-container flex flex-wrap gap-1.5 mt-2 pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-700"></div>
                        `;


                                        const filesContainer = accRow.querySelector(".sidebar-files-container");
                                        if (filesContainer && acc.files && acc.files.length > 0) {
                                            filesContainer.style.display = "flex";

                                            acc.files.forEach(f => {
                                                const filePill = document.createElement("div");
                                                filePill.className = "inline-flex items-center gap-1";

                                                const ext = f.fileName.split('.').pop().toLowerCase();
                                                const isImg = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);

                                                filePill.innerHTML = `
                                    <a href="/uploads/${f.storedName}" download="${f.fileName}" class="custom-file-pill inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors decoration-none font-medium">
                                        📎 ${f.fileName}
                                    </a>
                                    ${isImg ? `
                                    <button type="button" title="Просмотр" onclick="openImagePreview('/uploads/${f.storedName}')" class="custom-file-btn flex items-center justify-center w-5 h-5 rounded border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 cursor-pointer">
                                        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 text-gray-500 dark:text-gray-400">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>` : ''}
                                `;
                                                filesContainer.appendChild(filePill);
                                            });
                                        } else {
                                            if (filesContainer) filesContainer.remove();
                                        }

                                        accessesContainer.appendChild(accRow);
                                    });
                                } else {
                                    if (accessesContainer) accessesContainer.style.display = "none";
                                }





















                                sidebarHostsContainer.appendChild(hostClone);
                            });
                        } else {
                            sidebarHostsContainer.style.display = "block";
                            sidebarHostsContainer.innerHTML = `
                <div class="flex items-center space-x-1 text-gray-400 text-xs py-2 justify-center italic">
                    <span>Инфраструктура хостов отсутствует</span>
                </div>
            `;
                        }
                    }


                }












                const sidebarNoteText = sidebarSource.querySelector(".sidebar-enterprise-note-text");
                const sidebarDateText = sidebarSource.querySelector(".sidebar-enterprise-date-text");



                if (sidebarNoteText) {
                    const oldTxt = sidebarNoteText.textContent;
                    sidebarNoteText.textContent = item.note && item.note.trim() !== "" ? item.note : "Здесь ничего нет";
                }

                if (sidebarDateText) {
                    const oldDate = sidebarDateText.textContent;
                    sidebarDateText.textContent = `Изменено: ${item.updatedAt || item.updatedAtStr || "Неизвестно"}`;
                    sidebarDateText.setAttribute('data-copy-green', '')
                }













































                const listRowEl = clone.querySelector(".view-list-row");

                if (listRowEl) {
                    listRowEl.setAttribute("data-enterprise-id", item.id);
                    listRowEl.setAttribute("data-city-id", item.cityId || 0);
                    listRowEl.setAttribute("data-is-favorite", item.isFavorite ? "true" : "false");




















                    const listFavBtn = listRowEl.querySelector(".btn-card-favorite");

                    if (!listFavBtn) {
                        const backupListBtn = listFavBtn.querySelector("button");
                    }

                    if (listFavBtn) {
                        const oldId = listFavBtn.getAttribute("data-enterprise-id");
                        listFavBtn.setAttribute("data-enterprise-id", item.id);

                        const hasClassBefore = listFavBtn.classList.contains("is-in-favorite");
                        if (item.isFavorite) {
                            listFavBtn.classList.add("is-in-favorite");
                        } else {
                            listFavBtn.classList.remove("is-in-favorite");
                        }
                    }
















                    const listNameLink = listRowEl.querySelector(".enterprise-name-text") || listRowEl.querySelector("a[href*='/EnterpriseDetails']");
                    if (listNameLink) {
                        listNameLink.textContent = item.name;
                        listNameLink.setAttribute("onclick", `event.preventDefault(); saveToRecent(${item.id}, '${item.name}');window.location.href = this.href;`);
                        listNameLink.href = `/EnterpriseDetails?id=${item.id}`;
                    }

                    const listCityField = listRowEl.querySelector(".enterprise-city-text");
                    if (listCityField) {
                        listCityField.innerHTML = '<span class="mr-1">                            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5" >              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>               <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"></path>                        </svg>          </span>' + item.cityName;
                    }

                    const listContactName = listRowEl.querySelector(".enterprise-list-contact-name") || listRowEl.querySelector(".enterprise-contact-text");
                    if (listContactName) {
                        listContactName.textContent = item.contactUser || "Не указан";
                    }

                    const listContactPhone = listRowEl.querySelector(".enterprise-list-contact-phone") || listRowEl.querySelector("span.text-gray-400:last-of-type");
                    if (listContactPhone) {
                        listContactPhone.textContent = item.contactPhone || "Не указан";
                    }

                    const listDateField = listRowEl.querySelector(".enterprise-date-value");
                    if (listDateField) {
                        listDateField.textContent = item.updatedAt;
                    }








































                    const listHostsList = listRowEl.querySelector(".enterprise-hosts-preview-list");
                    const listNoHosts = listRowEl.querySelector(".enterprise-no-hosts-placeholder");
                    const listHostsTotal = listRowEl.querySelector(".enterprise-hosts-total-text");

                    console.log(item.hostsCount == 0);
                    if (item.hostsCount > 0) {
                        if (listNoHosts) {
                            listNoHosts.style.setProperty("display", "none", "important");
                            listNoHosts.classList.add("hidden");
                            console.log("test test");
                        }
                        if (item.hostsCount == 0) listHostsTotal.innerText = 'Нет серверов';

                        if (!listHostsList) {

                            const cellContainer = listNoHosts ? listNoHosts.parentElement : listRowEl.querySelector("div:nth-child(2)");

                            if (cellContainer) {
                                try {
                                    const wrapper = document.createElement("div");
                                    wrapper.className = "flex flex-col space-y-0.5 js-dynamic-hosts-wrapper";
                                    wrapper.innerHTML = `
                                        <div class="enterprise-hosts-preview-list flex flex-col space-y-0.5"></div>
                                        <span class="enterprise-hosts-total-text text-[11px] text-gray-400 dark:text-gray-500 mt-0.5"></span>
                                    `;
                                    cellContainer.appendChild(wrapper);
                                } catch (err) {
                                }
                            }
                        }

                        const activeHostsList = listRowEl.querySelector(".enterprise-hosts-preview-list");
                        const activeHostsTotal = listRowEl.querySelector(".enterprise-hosts-total-text");



                        if (activeHostsList && item.hostsPreview && item.hostsPreview.length > 0) {
                            activeHostsList.style.setProperty("display", "flex", "important");
                            activeHostsList.innerHTML = "";

                            item.hostsPreview.forEach((hostName, sIdx) => {
                                const hRow = document.createElement("div");
                                hRow.className = "flex items-center space-x-1";
                                hRow.innerHTML = `
                                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                    <span class="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]" title="${hostName}">${hostName}</span>
                                `;
                                activeHostsList.appendChild(hRow);
                            });
                        }

                        if (activeHostsTotal) {
                            activeHostsTotal.style.setProperty("display", "block", "important");

                            let word = "серверов";
                            const remainder10 = item.hostsCount % 10;
                            const remainder100 = item.hostsCount % 100;
                            if (remainder10 === 1 && remainder100 !== 11) word = "сервер";
                            else if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 10 || remainder100 >= 20)) word = "сервера";

                            activeHostsTotal.textContent = `Всего: ${item.hostsCount} ${word}`;
                        }
                    } else {
                        if (listHostsList) listHostsList.style.setProperty("display", "block", "important");
                        if (listHostsList) listHostsList.innerHTML = 'Нет серверов';
                        if (listHostsList) listHostsList.classList.remove("hidden");
                        if (listHostsList) listHostsList.classList.add("text-gray-400");
                        if (listHostsTotal) listHostsTotal.style.setProperty("display", "none", "important");
                        if (listNoHosts) {
                            listNoHosts.style.setProperty("display", "flex", "important");
                            listNoHosts.classList.remove("hidden");
                            listNoHosts.innerHTML = `
                                <span class="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></span>
                                <span class="text-gray-400 font-medium">Нет серверов</span>
                            `;
                        }
                    }











































                }










                const firstLiveWrapper = document.querySelector("#registry-items-container > div[data-is-favorite]");

                const cloneCard = clone.querySelector('[id^="enterprise-card-"]');
                const cloneRow = clone.querySelector('.enterprise-list-item-wrapper');

                if (firstLiveWrapper) {
                    const liveCard = firstLiveWrapper.querySelector('[id^="enterprise-card-"]');
                    const liveRow = firstLiveWrapper.querySelector('.enterprise-list-item-wrapper');

                    if (liveCard && cloneCard) cloneCard.style.cssText = liveCard.style.cssText;
                    if (liveRow && cloneRow) cloneRow.style.cssText = liveRow.style.cssText;

                    if (liveCard && cloneCard) {
                        if (liveCard.classList.contains('hidden')) cloneCard.classList.add('hidden');
                        else cloneCard.classList.remove('hidden');
                    }
                    if (liveRow && cloneRow) {
                        if (liveRow.classList.contains('hidden')) { cloneRow.classList.add('hidden'); }
                        else {
                            cloneRow.classList.remove('hidden');




                            
                        }
                    }
                } else {
                    if (cloneCard) cloneCard.style.cssText = pageState.savedCardStyle;
                    if (cloneRow) cloneRow.style.cssText = pageState.savedRowStyle;

                    if (cloneCard) {
                        if (pageState.savedCardHidden) cloneCard.classList.add('hidden');
                        else cloneCard.classList.remove('hidden');
                    }
                    if (cloneRow) {
                        if (pageState.savedRowHidden) cloneRow.classList.add('hidden');
                        else cloneRow.classList.remove('hidden');
                    }
                }

                


                

















                container.appendChild(clone);


                setupEnterpriseClickHandlers();















                if (pageState.offset === 0 && idx === 0 && window.savedListHeaderNode) {
                    const isListModeActive = (window.currentViewModel === "list" || (typeof currentViewModel !== 'undefined' && currentViewModel === "list") || !pageState.savedRowHidden);

                    if (isListModeActive) {
                        window.savedListHeaderNode.classList.remove('hidden');
                        window.savedListHeaderNode.style.setProperty('display', 'flex', 'important');

                        //if (!document.getElementById("enterprises-table-header")) {

                          //  rebindHeaderSortEvents(window.savedListHeaderNode);

                            //container.prepend(window.savedListHeaderNode);
                        //}
                    } else {
                        window.savedListHeaderNode.classList.add('hidden');
                        window.savedListHeaderNode.style.setProperty('display', 'none', 'important');

                        //const existingHeader = document.getElementById("enterprises-table-header");
                        //if (existingHeader) {
                          //  existingHeader.classList.add('hidden');
                            //existingHeader.style.setProperty('display', 'none', 'important');
                        //}
                    }
                }









            });











            ///////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////

            pageState.offset += data.length;

            if (data.length < pageState.limit) {
                pageState.hasMoreData = false;
                if (loader) loader.textContent = "Все элементы загружены";
            }

            updateCounterBadge();
        })
        .catch(error => {
            if (loader) loader.textContent = "❌ Ошибка загрузки данных";
        })
        .finally(() => {
            pageState.isLoading = false;
        });
}

function applyGlobalFilters() {
    const loader = document.getElementById("scroll-loader");


    pageState.offset = 0;
    pageState.hasMoreData = true;
    pageState.isLoading = false;

    syncData(loader);
}


function initFilterInterceptors() {
    const favToggle = document.getElementById("filter-favorites-toggle");
    if (favToggle) {
        favToggle.addEventListener("click", (e) => {
            e.preventDefault();

            pageState.isFavoriteOnly = !pageState.isFavoriteOnly;

            if (pageState.isFavoriteOnly) {
                favToggle.classList.remove("bg-white", "text-gray-400", "border-gray-300", "dark:bg-gray-900");
                favToggle.classList.add("bg-amber-50", "text-amber-500", "border-amber-300", "dark:bg-amber-950/40");
            } else {
                favToggle.classList.remove("bg-amber-50", "text-amber-500", "border-amber-300", "dark:bg-amber-950/40");
                favToggle.classList.add("bg-white", "text-gray-400", "border-gray-300", "dark:bg-gray-900");
            }

            applyGlobalFilters();
        });
    } 

    const selectOptions = document.querySelectorAll("#filter-city-options .custom-select-option");

    selectOptions.forEach((option, idx) => {
        option.addEventListener("click", () => {
            const rawValue = option.getAttribute("data-value");
            const parsedId = parseInt(rawValue, 10);

            pageState.cityId = !isNaN(parsedId) && parsedId > 0 ? parsedId : null;

            applyGlobalFilters();
        });
    });
}


function createDebounceHandler(callback, delay = 400) {
    let timeoutId = null;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}

const handleSearchInput = createDebounceHandler(() => {
    const searchInput = document.getElementById("search-input");
    pageState.searchString = searchInput ? searchInput.value.trim() : "";

    applyGlobalFilters();
});

const globalSearchInput = document.getElementById("search-input");
if (globalSearchInput) {
    globalSearchInput.addEventListener("input", () => {
        handleSearchInput();
    });
} 


function updateCounterBadge() {
    const counterBadge = document.getElementById("counter-badge");

    if (!counterBadge) return;

    const realCardsCount = document.querySelectorAll("#registry-items-container > div:not(#enterprises-table-header)").length;

    counterBadge.textContent = realCardsCount;
}























































function rebindHeaderSortEvents(headerNode) {
    if (!headerNode) return;

    const btnName = headerNode.querySelector("#sort-by-name");
    const btnDate = headerNode.querySelector("#sort-by-date");

    if (btnName) {
        btnName.addEventListener("click", () => {
            if (currentSortField === "name") {
                currentSortOrder = (currentSortOrder === "asc") ? "desc" : "asc";
            } else {
                currentSortField = "name";
                currentSortOrder = "asc";
            }
            if (typeof updateSortButtonsUI === "function") updateSortButtonsUI();
            applyGlobalFilters(); 
        });
    }

    if (btnDate) {
        btnDate.addEventListener("click", () => {
            if (currentSortField === "date") {
                currentSortOrder = (currentSortOrder === "asc") ? "desc" : "asc";
            } else {
                currentSortField = "date";
                currentSortOrder = "asc";
            }
            if (typeof updateSortButtonsUI === "function") updateSortButtonsUI();
            applyGlobalFilters(); 
        });
    }

}




























function initHeaderSorting() {
    const btnName = document.getElementById("sort-by-name");
    const btnDate = document.getElementById("sort-by-date");

    if (btnName) {
        btnName.addEventListener("click", () => {
            if (pageState.sortField === "name") {
                pageState.sortOrder = (pageState.sortOrder === "asc") ? "desc" : "asc";
            } else {
                pageState.sortField = "name";
                pageState.sortOrder = "asc";
            }


            updateSortIconsUI(btnName, pageState.sortOrder);

            applyGlobalFilters();
        });
    }

    if (btnDate) {
        btnDate.addEventListener("click", () => {
            if (pageState.sortField === "date") {
                pageState.sortOrder = (pageState.sortOrder === "asc") ? "desc" : "asc";
            } else {
                pageState.sortField = "date";
                pageState.sortOrder = "asc";
            }


            updateSortIconsUI(btnDate, pageState.sortOrder);
            applyGlobalFilters();
        });
    }
}

function updateSortIconsUI(activeButton, order) {
    document.querySelectorAll("#enterprises-table-header button").forEach(btn => {
        btn.classList.remove("is-active-sort", "sort-sort-desc");
        const icon = btn.querySelector(".sort-icon");
        if (icon) icon.style.transform = "rotate(0deg)";
    });

    activeButton.classList.add("is-active-sort");
    const activeIcon = activeButton.querySelector(".sort-icon");

    if (activeIcon) {
        if (order === "desc") {
            activeButton.classList.add("sort-sort-desc");
            activeIcon.style.transform = "rotate(180deg)";
        } else {
            activeIcon.style.transform = "rotate(0deg)";
        }
    }
}
