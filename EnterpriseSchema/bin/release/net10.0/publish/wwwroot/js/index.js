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
        console.error('Ошибка AJAX:', error);
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




document.addEventListener("DOMContentLoaded", function () {
    renderRecentEnterprises();
    setupEnterpriseClickHandlers();
    initCustomSelects();


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
        searchInput.addEventListener('input', applyRegistryFilters);
    }

    if (cityOptionsBlock) {
        const cityOptions = cityOptionsBlock.querySelectorAll('.custom-select-option');
        cityOptions.forEach(option => {
            option.addEventListener('click', function () {
                setTimeout(applyRegistryFilters, 10);
            });
        });
    }

    if (btnList) {
        btnList.addEventListener('click', function () {
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

            applyRegistryFilters();
        });
    }

    if (btnGrid) {
        btnGrid.addEventListener('click', function () {
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

            applyRegistryFilters();
        });
    }


    if (btnFavToggle) {
        btnFavToggle.addEventListener('click', function () {
            btnFavToggle.classList.toggle('is-active-fav'); 
            applyRegistryFilters(); 
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
            applyRegistryFilters();
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
            applyRegistryFilters(); 
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
                applyRegistryFilters();
            }
        } else {
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
            togglePassBtn.innerHTML = `<svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
        } else {
            passContainer.textContent = '••••••••';
            passContainer.setAttribute('data-hidden', 'true');
            passContainer.setAttribute('data-copy-target', passContainer.getAttribute('data-real-password'));
            togglePassBtn.innerHTML = `<svg xmlns="http://w3.org" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="eye-icon-1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 014.13-5.24M7.42 7.42L16.6 16.6M9.88 9.88a3 3 0 104.24 4.24M10.804 5.204A10.015 10.015 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.24M3 3l18 18"></path></svg>`;
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



  