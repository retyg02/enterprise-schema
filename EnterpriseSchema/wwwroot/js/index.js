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

            const selectList = document.getElementById('NewEnterprise_CityId') || document.querySelector('select[name="NewEnterprise.CityId"]');
            
            if (selectList) {
                const newOption = document.createElement('option');
                newOption.value = data.id;
                newOption.text = data.name;
                newOption.selected = true;

                selectList.add(newOption);
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
