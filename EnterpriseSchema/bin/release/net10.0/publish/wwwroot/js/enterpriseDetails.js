
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
    closeModal('accessTypeModal');
}
 else {
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
                    <span class="font-bold text-gray-900 added-service-name">${srv.name}</span> 
                    <span class="text-gray-400 added-service-desc">(${srv.description || 'нет описания'})</span>
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





function generateSecurePassword() {
    const input = document.getElementById('accessPass');
    if (!input) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~-=";
    let password = "";
    
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    input.value = "";
    let currentIdx = 0;

    input.classList.remove('border-gray-300', 'focus:ring-indigo-500');
    input.classList.add('border-emerald-500', 'ring-2', 'ring-emerald-500/30', 'bg-emerald-50/30');
    
    const typingInterval = setInterval(() => {
        if (currentIdx < password.length) {
            input.value += password.charAt(currentIdx);
            currentIdx++;
        } else {
            clearInterval(typingInterval);
            
            input.classList.remove('border-emerald-500', 'ring-2', 'ring-emerald-500/30', 'bg-emerald-50/30');
            input.classList.add('border-gray-300', 'focus:ring-indigo-500');
            
        }
    }, 25);
}





function toggleParanoiaMode() {
    const secretFields = document.querySelectorAll('.secret-data');
    const toggleBtn = document.getElementById('paranoia-toggle-btn');
    
    if (secretFields.length === 0 || !toggleBtn) return;

    const isCurrentlyBlurred = secretFields[0].classList.contains('spy-blur');

    secretFields.forEach(field => {
        if (isCurrentlyBlurred) {
            field.classList.remove('spy-blur');
        } else {
            field.classList.add('spy-blur');
        }
    });

    if (!isCurrentlyBlurred) {
        toggleBtn.classList.remove('text-gray-400');
        toggleBtn.classList.add('text-emerald-500');
        toggleBtn.firstElementChild.classList.add('rotate-12');
    } else {
        toggleBtn.classList.remove('text-emerald-500');
        toggleBtn.classList.add('text-gray-400');
        toggleBtn.firstElementChild.classList.remove('rotate-12');
    }
}




document.addEventListener("DOMContentLoaded", function () {
    initCustomSelects();
});




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






document.addEventListener('DOMContentLoaded', () => {
    
    document.addEventListener('click', function(e) {
        
        const copyElement = e.target.closest('.js-universal-copy');
        if (!copyElement) return;

        if (e.target.closest('a') || e.target.closest('button')) {
            e.preventDefault();
        }

        const textToCopy = copyElement.innerText.trim();
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            
            copyElement.classList.add(
                '!bg-indigo-600', 
                '!text-white', 
                'scale-[1.03]', 
                'shadow-md', 
                'transition-all', 
                'duration-150'
            );
            
            const innerSVGs = copyElement.querySelectorAll('svg, path');
            innerSVGs.forEach(svg => {
                svg.style.setProperty('stroke', '#ffffff', 'important');
            });

            setTimeout(() => {
                copyElement.classList.remove(
                    '!bg-indigo-600', 
                    '!text-white', 
                    'scale-[1.03]', 
                    'shadow-md'
                );
                innerSVGs.forEach(svg => {
                    svg.style.removeProperty('stroke');
                });
            }, 200);

        }).catch(err => {
            console.error('Критический сбой работы буфера обмена:', err);
        });
    });
});




console.log('1');


document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("universalEditModal");
    const editForm = document.getElementById("universal-edit-form"); 
    const editInput = document.getElementById("modal-edit-input");
    const errorSummary = document.getElementById("modal-edit-error-summary");

    const btnClose = document.getElementById("btn-close-edit-modal");
    const btnCancel = document.getElementById("btn-cancel-edit-modal");

    const modalContent = modal ? modal.querySelector('.transform') : null;

    if (!modal || !editForm || !editInput) {
        return;
    }

    document.addEventListener("click", (e) => {
        const trigger = e.target.closest(".js-btn-trigger-edit");
        if (!trigger) return;

        e.preventDefault();

        const fieldKey = trigger.getAttribute("data-field-key"); 
        const fieldTitle = trigger.getAttribute("data-field-title");
        const fieldLabel = trigger.getAttribute("data-field-label");

        const mirrorInput = document.getElementById(`details-mirror-${fieldKey}`);
        const currentMirrorValue = mirrorInput ? mirrorInput.value : "";

        document.getElementById("modal-edit-title").textContent = fieldTitle;
        document.getElementById("modal-edit-label").textContent = fieldLabel;
        document.getElementById("modal-field-key").value = fieldKey;

        editInput.value = currentMirrorValue.trim();
        if (errorSummary) errorSummary.classList.add("hidden");

        modal.classList.remove("hidden");
        modal.classList.add("flex");

        setTimeout(() => {
            if (modalContent) {
                modalContent.classList.remove("scale-95", "opacity-0");
                modalContent.classList.add("scale-100", "opacity-100");
            }

            editInput.focus();
            editInput.select();
        }, 20);
    });

    function closeEditModal() {
        if (modalContent) {
            modalContent.classList.remove("scale-100", "opacity-100");
            modalContent.classList.add("scale-95", "opacity-0");
        }
        setTimeout(() => {
            modal.classList.remove("flex");
            modal.classList.add("hidden");
            editForm.classList.remove("pointer-events-none", "opacity-70");
        }, 300);
    }

    if (btnClose) btnClose.addEventListener("click", closeEditModal);
    if (btnCancel) btnCancel.addEventListener("click", closeEditModal);

    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        editForm.classList.add("pointer-events-none", "opacity-70");
        if (errorSummary) errorSummary.classList.add("hidden");

        const targetFieldKey = document.getElementById("modal-field-key").value;
        const newValue = editInput.value.trim();

        const targetMirror = document.getElementById(`details-mirror-${targetFieldKey}`);
        if (targetMirror) {
            targetMirror.value = newValue;
        }

        const updateData = {
            id: parseInt(document.getElementById("details-mirror-id").value),
            name: document.getElementById("details-mirror-name").value.trim(),
            cityId: parseInt(document.getElementById("details-mirror-cityId").value),
            contact: document.getElementById("details-mirror-contact").value.trim(),
            contactPhone: document.getElementById("details-mirror-contactPhone").value.trim(),
            note: document.getElementById("details-mirror-note").value.trim()
        };

        console.log(updateData);

        const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value || "";

        try {
            
            const response = await fetch("/Index?handler=Update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updateData)
            });
            
            if (response.ok) {
                console.log('1');
                

                
                
                document.getElementById(`details-display-context-${targetFieldKey}`).innerText = newValue;
                
                

                closeEditModal();
            } else {
                const errData = await response.json();
                showErrors(errData.errors || ["Произошла ошибка при сохранении данных в базу"]);
            }
        } catch (error) {
            console.log(targetFieldKey);
            console.log(document.getElementById(`details-display-context-${targetFieldKey}`));
            console.error("ошибка:", error);
            showErrors(["Не удалось связаться с сервером. Проверьте подключение к сети."]);
        } finally {
            editForm.classList.remove("pointer-events-none", "opacity-70");
        }
    });

    function showErrors(errorsArray) {
        if (!errorSummary) return;
        const ul = errorSummary.querySelector("ul");
        if (!ul) return;

        ul.innerHTML = "";
        errorsArray.forEach(err => {
            const li = document.createElement("li");
            li.textContent = err;
            ul.appendChild(li);
        });
        errorSummary.classList.remove("hidden");
    }
});






async function submitDeleteEnt(event, id, name) {
    event.preventDefault();

    if (!confirm(`Вы уверены, что хотите удалить предприятие "${name}" и все связанные серверы?`)) {
        return;
    }

    const ent = document.getElementById('all_enterprise_full');
    if (ent) {
        ent.classList.add('blur-[2px]', 'opacity-60', 'pointer-events-none');
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
            window.location.href = '/Index';
        } else {
            if (ent) ent.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
            alert('Не удалось удалить предприятие.');
        }
    } catch (error) {
        if (ent) ent.classList.remove('blur-[2px]', 'opacity-60', 'pointer-events-none');
        console.error('Ошибка при удалении:', error);
    }
}



















function uploadAccessFile(input, accessId) {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accessId', accessId);

    const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;

    fetch(`?handler=UploadFile`, {
        method: 'POST',
        headers: {
            'RequestVerificationToken': token
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        const filesContainer = document.getElementById(`files-list-${accessId}`);
        if (filesContainer) {
            const fileLink = document.createElement('a');
            
            fileLink.href = `/uploads/${data.storedFileName}`;
            fileLink.setAttribute('download', data.fileName);
            
            fileLink.className = "custom-file-pill inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 rounded border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer decoration-none";
            fileLink.innerHTML = `📎 ${data.fileName}`;
            
            filesContainer.appendChild(fileLink);
        }
        input.value = '';
    } else {
        alert('Ошибка загрузки: ' + data.error);
    }
})
    .catch(error => {
        console.error('Error:', error);
        alert('Критическая ошибка при отправке файла');
    });
}
