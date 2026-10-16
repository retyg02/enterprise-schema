
function filterHosts() {
    const searchInput = document.getElementById('hostSearchInput');
    const clearBtn = document.getElementById('clearHostSearchBtn');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length > 0) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }

    const hostCards = document.querySelectorAll('.host-card');
    let visibleCount = 0;

    hostCards.forEach(card => {
        const textContent = card.textContent.toLowerCase();

        if (textContent.includes(query)) {
            card.classList.remove('hidden');
            setTimeout(() => card.classList.remove('opacity-0'), 10);
            visibleCount++;
        } else {
            card.classList.add('opacity-0', 'hidden');
        }
    });

    const counter = document.getElementById('hostsCounter');
    if (counter) {
        counter.textContent = visibleCount;
    }
}

function clearHostSearch() {
    const searchInput = document.getElementById('hostSearchInput');
    searchInput.value = '';
    filterHosts();
    searchInput.focus();
}





function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (modal.firstElementChild) {
        modal.firstElementChild.classList.remove('translate-y-full', 'md:scale-95');
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
        modal.classList.add('opacity-100');
        if (modal.firstElementChild) {
            modal.firstElementChild.classList.add('translate-y-0', 'md:scale-100');
        }
    }, 10);
}

function closeModal(id, isNotModal = false) {
    const modal = document.getElementById(id);
    if (!modal) return;
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


async function submitHostForm(event) {
    event.preventDefault();

    const errorSummary = document.getElementById('hostErrorSummary');
    errorSummary.classList.add('hidden');
    errorSummary.innerHTML = '';

    const hostCardsContainer = document.querySelector('.host-card')?.parentElement;
    if (hostCardsContainer) {
        hostCardsContainer.classList.add('blur-[1px]', 'opacity-75', 'pointer-events-none');
    }

    const hostData = {
    enterpriseId: parseInt(document.getElementById('hostEnterpriseId').value),

    name: document.getElementById('hostName')?.value.trim() || document.getElementById('NewHost_Name')?.value.trim() || '',
    ip: document.getElementById('hostIp')?.value.trim() || document.getElementById('NewHost_Ip')?.value.trim() || '',
    purpose: document.getElementById('hostPurpose')?.value.trim() || document.getElementById('NewHost_Purpose')?.value.trim() || '',
    osName: document.getElementById('hostOsName')?.value.trim() || document.getElementById('NewHost_OsName')?.value.trim() || '',
    osVer: document.getElementById('hostOsVer')?.value.trim() || document.getElementById('NewHost_OsVer')?.value.trim() || '',
    osType: document.getElementById('hostOsType')?.value.trim() || document.getElementById('NewHost_OsType')?.value.trim() || '',
    networkInterfaces: document.getElementById('hostNetInterfaces')?.value.trim() || document.getElementById('NewHost_NetworkInterfaces')?.value.trim() || '',
    notes: document.getElementById('hostNotes')?.value.trim() || document.getElementById('NewHost_Notes')?.value.trim() || ''
};


    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch('/EnterpriseDetails?handler=CreateHost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify(hostData)
        });

        if (response.ok) {
            window.location.reload();
        } else {
            if (hostCardsContainer) hostCardsContainer.classList.remove('blur-[1px]', 'opacity-75', 'pointer-events-none');
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
        if (hostCardsContainer) hostCardsContainer.classList.remove('blur-[1px]', 'opacity-75', 'pointer-events-none');
        console.error('Ошибка создания хоста:', error);
    }
}



async function submitDeleteHost(event, id, name) {
    event.preventDefault();
    
    if (!confirm(`Вы уверены, что хотите полностью удалить сервер "${name}" и все связанные с ним доступы?`)) {
        return;
    }

    const card = document.getElementById(`host-card-${id}`);
    if (card) {
        card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
    }

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

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
            if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
            alert('Не удалось удалить сервер.');
        }
    } catch (error) {
        if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
        console.error('Ошибка при удалении хоста:', error);
    }
}





function openCreateAccessModal(hostId) {
    document.getElementById('accessHostId').value = hostId;
    openModal('createAccessModal');
}

async function submitAccessForm(event) {
    event.preventDefault();

    const errorSummary = document.getElementById('accessErrorSummary');
    errorSummary.classList.add('hidden');
    errorSummary.innerHTML = '';

    const hostId = document.getElementById('accessHostId').value;
    const card = document.getElementById(`host-card-${hostId}`);
    if (card) {
        card.classList.add('blur-[1px]', 'opacity-75', 'pointer-events-none');
    }

    const accessData = {
        hostId: parseInt(hostId),
        accessTypeId: parseInt(document.getElementById('accessAccessTypeId').value),
        address: document.getElementById('accessAddress').value.trim(),
        port: parseInt(document.getElementById('accessPort').value),
        login: document.getElementById('accessLogin').value.trim(),
        pass: document.getElementById('accessPass').value.trim(),
        note: document.getElementById('accessNote').value.trim()
    };

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch('/EnterpriseDetails?handler=CreateAccess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify(accessData)
        });

        if (response.ok) {
            window.location.reload();
        } else {
            if (card) card.classList.remove('blur-[1px]', 'opacity-75', 'pointer-events-none');
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
        if (card) card.classList.remove('blur-[1px]', 'opacity-75', 'pointer-events-none');
        console.error('Ошибка создания доступа:', error);
    }
}





async function submitDeleteAccess(event, id, login, hostId) {
    event.preventDefault();
    
    if (!confirm(`Вы уверены, что хотите удалить доступ для пользователя "${login}"?`)) {
        return;
    }

    const card = document.getElementById(`host-card-${hostId}`);
    if (card) {
        card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
    }

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

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
            if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
            alert('Не удалось удалить параметры доступа.');
        }
    } catch (error) {
        if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
        console.error('Ошибка при удалении доступа:', error);
    }
}





function togglePassword(id, decryptedPass) {
    const textSpan = document.getElementById(`pass-text-${id}`);
    const eyeIcon = document.getElementById(`eye-icon-${id}`);

    if (textSpan.textContent.includes('••••••••')) {
        textSpan.textContent = decryptedPass;
        textSpan.classList.remove('font-sans');
        textSpan.classList.add('font-mono');
        
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 014.13-5.24M7.42 7.42L16.6 16.6M9.88 9.88a3 3 0 104.24 4.24M10.804 5.204A10.015 10.015 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.24M3 3l18 18" />`;
    } else {
        textSpan.textContent = '••••••••';
        textSpan.classList.remove('font-mono');
        textSpan.classList.add('font-sans');
        
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
    }
}

async function copyToClipboard(element, text) {
    if (text === '••••••••' || !text) return;

    try {
        await navigator.clipboard.writeText(text);

        const originalClasses = element.className;

        element.className = "text-emerald-600 font-bold transition-colors duration-150";
        const originalText = element.textContent;
        
        if (originalText === '••••••••') {
            element.textContent = 'Скопировано!';
        }

        setTimeout(() => {
            element.className = originalClasses;
            if (originalText === '••••••••') element.textContent = originalText;
        }, 600);

    } catch (err) {
        console.error('Не удалось скопировать текст: ', err);
    }
}





async function submitAccessTypeForm(event) {
    event.preventDefault();

    const input = document.getElementById('accessTypeNameInput');
    const typeName = input.value.trim();
    if (!typeName) return;

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch('/EnterpriseDetails?handler=CreateAccessType', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify(typeName)
        });

        if (response.ok) {
            const data = await response.json();
            const selectList = document.getElementById('accessAccessTypeId');
            
            if (selectList) {
                const newOption = document.createElement('option');
                newOption.value = data.id;
                newOption.text = data.name;
                newOption.selected = true;
                selectList.add(newOption);
            }

            input.value = '';
            closeModal('accessTypeModal');
        } else {
            alert('Ошибка при добавлении типа доступа');
        }
    } catch (error) {
        console.error('Ошибка AJAX типа доступа:', error);
    }
}









function openUpdateHostModal(id, name, ip, purpose, osName, osVer, osType, netInterfaces, notes) {
    document.getElementById('updateHostId').value = id;
    document.getElementById('updateHostName').value = name;
    document.getElementById('updateHostIp').value = ip;
    document.getElementById('updateHostPurpose').value = purpose;
    document.getElementById('updateHostOsName').value = osName;
    document.getElementById('updateHostOsVer').value = osVer;
    document.getElementById('updateHostOsType').value = osType;
    document.getElementById('updateHostNetInterfaces').value = decodeURIComponent(netInterfaces) || netInterfaces;
    document.getElementById('updateHostNotes').value = notes || '';

    openModal('updateHostModal');
}




let tempServices = [];


function openServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (!modal) return;
    if (modal.firstElementChild) {
        modal.firstElementChild.classList.remove('translate-y-full', 'md:scale-95');
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.add('opacity-100');
        modal.firstElementChild.classList.remove('scale-95');
    }, 10);
}


function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (!modal) return;
    modal.classList.remove('opacity-100');
    modal.firstElementChild.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}


function submitServiceForm(event) {
    event.preventDefault();

    const name = document.getElementById('serviceNameInput').value.trim();
    const desc = document.getElementById('serviceDescInput').value.trim();
    const path = document.getElementById('servicePathInput').value.trim();

    if (!name || !path) return;

    const tempId = Date.now();

    tempServices.push({ tempId, name, description: desc, path });

    renderTempServices();

    document.getElementById('serviceNameInput').value = '';
    document.getElementById('serviceDescInput').value = '';
    document.getElementById('servicePathInput').value = '';
    closeServiceModal();
}


function renderTempServices() {
    const container = document.getElementById('addedServicesList');
    container.innerHTML = '';

    tempServices.forEach(srv => {
        container.innerHTML += `
            <div class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2 text-[11px] animate-fade-in">
                <div class="font-mono">
                    <span class="font-bold text-gray-900">${srv.name}</span> 
                    <span class="text-gray-400">(${srv.description || 'нет описания'})</span>
                    <div class="text-gray-500 text-[10px] mt-0.5 font-semibold">📍 ${srv.path}</div>
                </div>
                <button type="button" onclick="removeTempService(${srv.tempId})" class="text-gray-400 hover:text-red-600 p-1 focus:outline-none text-xs font-bold" title="Удалить службу">&times;</button>
            </div>
        `;
    });
}


function removeTempService(tempId) {
    tempServices = tempServices.filter(srv => srv.tempId !== tempId);
    renderTempServices();
}


function clearHostFormAdditions() {
    tempServices = [];
    document.getElementById('addedServicesList').innerHTML = '';
    closeModal('updateHostModal', true);
}


async function submitUpdateHostForm(event) {
    event.preventDefault();

    const errorSummary = document.getElementById('updateHostErrorSummary');
    errorSummary.classList.add('hidden');
    errorSummary.innerHTML = '';

    const id = parseInt(document.getElementById('updateHostId').value);
    const card = document.getElementById(`host-card-${id}`);
    if (card) card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');

    const payload = {
        id: id,
        name: document.getElementById('updateHostName').value.trim(),
        ip: document.getElementById('updateHostIp').value.trim(),
        purpose: document.getElementById('updateHostPurpose').value.trim(),
        osName: document.getElementById('updateHostOsName').value.trim(),
        osVer: document.getElementById('updateHostOsVer').value.trim(),
        osType: document.getElementById('updateHostOsType').value.trim(),
        networkInterfaces: document.getElementById('updateHostNetInterfaces').value.trim(),
        notes: document.getElementById('updateHostNotes').value.trim(),

        newServices: tempServices 
    };

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch('/EnterpriseDetails?handler=UpdateHost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': token
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            tempServices = [];
            window.location.reload();
        } else {
            if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
            const data = await response.json();
            if (data.errors && data.errors.length > 0) {
                errorSummary.classList.remove('hidden');
                errorSummary.innerHTML = '<ul class="list-disc pl-4 space-y-1"></ul>';
                const ul = errorSummary.querySelector('ul');
                data.errors.forEach(err => ul.innerHTML += `<li>${err}</li>`);
            }
        }
    } catch (error) {
        if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
        console.error('Ошибка транзакции хоста:', error);
    }
}





async function submitDeleteService(event, id, name) {
    event.preventDefault();

    if (!confirm(`Вы уверены, что хотите полностью удалить службу "${name}"?`)) {
        return;
    }

    const card = document.getElementById(`service-card-${id}`);
    if (card) {
        card.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
    }

    const token = document.querySelector('input[name="__RequestVerificationToken"]').value;

    try {
        const response = await fetch(`/EnterpriseDetails?handler=DeleteService&id=${id}`, {
            method: 'POST',
            headers: {
                'RequestVerificationToken': token
            }
        });

        if (response.ok) {
            window.location.reload();
        } else {
            if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
            alert('Не удалось удалить службу.');
        }
    } catch (error) {
        if (card) card.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
        console.error('Ошибка при удалении службы:', error);
    }
}