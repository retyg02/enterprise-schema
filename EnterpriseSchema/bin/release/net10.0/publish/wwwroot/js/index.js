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






    function openUpdateModal(id, name, cityId, contact, note) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateName').value = name;
    document.getElementById('updateCityId').value = cityId;
    document.getElementById('updateContact').value = contact;
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

    const input = document.getElementById('cityNameInput');
    const cityName = input.value.trim();
    if (!cityName) return;

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

        if (response.ok) {
    const data = await response.json();

    const container = document.querySelector('.custom-select-container');
    if (container) {
        const optionsBlock = container.querySelector('.custom-select-options');
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
    
    if (searchInput && noResultsMessage) {
        const totalEnterprises = counterBadge ? parseInt(counterBadge.textContent) : 0;

        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.enterprise-card-item');
            let visibleCardsCount = 0;

            cards.forEach(card => {
                const nameText = card.querySelector('.enterprise-name-text');
                const contactText = card.querySelector('.enterprise-contact-text');
                const noteText = card.querySelector('.enterprise-note-text');
                const cityText = card.querySelector('.enterprise-city-text');

                const ipTextContainer = card.querySelector('.enterprise-hosts-ips');
                const ips = ipTextContainer ? ipTextContainer.textContent.toLowerCase() : "";

                if (nameText) {
                    const name = nameText.textContent.toLowerCase();
                    const contact = contactText.textContent.toLowerCase();
                    const note = noteText.textContent.toLowerCase();
                    const city = cityText.textContent.toLowerCase();
                    
                    if (name.includes(query) || contact.includes(query) || note.includes(query) || city.includes(query) || ips.includes(query)) {
                        card.style.display = "";
                        card.classList.remove('opacity-0');
                        visibleCardsCount++;
                    } else {
                        card.style.display = "none";
                        card.classList.add('opacity-0');
                    }
                }
            });

            if (counterBadge) {
                counterBadge.textContent = query.length === 0 ? totalEnterprises : visibleCardsCount;
            }

            if (visibleCardsCount === 0 && query.length > 0) {
                noResultsMessage.classList.remove('hidden');
            } else {
                noResultsMessage.classList.add('hidden');
            }

        });
    }
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