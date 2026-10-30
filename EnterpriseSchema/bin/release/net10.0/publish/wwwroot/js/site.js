document.addEventListener("DOMContentLoaded", function () {
    const isDark = document.body.classList.contains("dark-mode");
    updateToggleUI(isDark);
});

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle("dark-mode");

    localStorage.setItem("theme_mode", isDark ? "dark" : "Light");
    updateToggleUI(isDark);
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('mobile-menu-sidebar');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    if (!sidebar || !backdrop) return;

    const isHidden = sidebar.classList.contains('-translate-x-full');

    if (isHidden) {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
    }
}

function updateToggleUI(isDark) {
    const btnPc = document.getElementById("theme-toggle-btn");
    const ballPc = document.getElementById("theme-toggle-ball");
    
    const btnMob = document.getElementById("theme-toggle-btn-mobile");
    const ballMob = document.getElementById("theme-toggle-ball-mobile");

    if (btnPc && ballPc) {
        if (isDark) {
            btnPc.classList.remove("bg-gray-200");
            btnPc.classList.add("bg-indigo-500");
            ballPc.classList.remove("translate-x-0.5");
            ballPc.classList.add("translate-x-5");
            ballPc.textContent = "🌙";
        } else {
            btnPc.classList.remove("bg-indigo-500");
            btnPc.classList.add("bg-gray-200");
            ballPc.classList.remove("translate-x-5");
            ballPc.classList.add("translate-x-0.5");
            ballPc.textContent = "☀️";
        }
    }

    if (btnMob && ballMob) {
        if (isDark) {
            btnMob.classList.remove("bg-gray-200");
            btnMob.classList.add("bg-indigo-500");
            ballMob.classList.remove("translate-x-0.5");
            ballMob.classList.add("translate-x-5");
            ballMob.textContent = "🌙";
        } else {
            btnMob.classList.remove("bg-indigo-500");
            btnMob.classList.add("bg-gray-200");
            ballMob.classList.remove("translate-x-5");
            ballMob.classList.add("translate-x-0.5");
            ballMob.textContent = "☀️";
        }
    }
}




document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.code === 'KeyK') {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            event.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('search-input');
    const kbdContainer = document.getElementById('search-kbd-container');
    
    if (!searchInput || !kbdContainer) return;

    function checkKbdVisibility() {
        if (document.activeElement === searchInput || searchInput.value.trim() !== "") {
            kbdContainer.classList.add('opacity-0', 'pointer-events-none');
        } else {
            kbdContainer.classList.remove('opacity-0', 'pointer-events-none');
        }
    }

    checkKbdVisibility();

    searchInput.addEventListener('focus', checkKbdVisibility);
    searchInput.addEventListener('blur', checkKbdVisibility);
    searchInput.addEventListener('input', checkKbdVisibility);
});







document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("settingsModal");
    const btnDesktop = document.getElementById("btn-settings-desktop");
    const btnMobile = document.getElementById("btn-settings-mobile");
    
    const closeButtons = modal ? modal.querySelectorAll('[data-modal-close="settingsModal"]') : [];

    function openSettingsModal(e) {
        if (!modal) return;
        e.preventDefault();
        e.stopPropagation();
        
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        
        document.body.classList.add("overflow-hidden");
        
        const mobileSidebar = document.getElementById("mobile-menu-sidebar");
        if (mobileSidebar && !mobileSidebar.classList.contains("-translate-x-full")) {
            if (typeof ToggleMobileMenu === "function") {
                ToggleMobileMenu();
            } else if (typeof toggleMobileMenu === "function") {
                toggleMobileMenu();
            } else {
                mobileSidebar.classList.add("-translate-x-full");
            }
        }
    }

    function closeSettingsModal() {
        if (!modal) return;
        
        modal.classList.remove("flex");
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");

        const mobileOverlays = document.querySelectorAll('[id*="overlay"], [class*="bg-gray-900/50"]');
        mobileOverlays.forEach(overlay => {
            if (overlay !== modal && !modal.contains(overlay) && overlay.tagName !== "HEADER") {
                overlay.classList.add("hidden");
                overlay.classList.remove("flex", "block");
            }
        });
    }



    if (btnDesktop) {
        btnDesktop.addEventListener("click", openSettingsModal);
    }
    if (btnMobile) {
        btnMobile.addEventListener("click", openSettingsModal);
    }

    closeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            closeSettingsModal();
        });
    });

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeSettingsModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
            closeSettingsModal();
        }
    });
});


































document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', function (e) {

        const copyElement = e.target.closest('[data-copy-green]');
        if (!copyElement) return;

        if (e.target.closest('a') || e.target.closest('button')) {
            e.preventDefault();
        }

        const textToCopy = copyElement.innerText.trim();
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {

            copyElement.classList.add(
                '!bg-emerald-500',
                '!text-white',
                'scale-[1.02]',
                'shadow-sm',
                'transition-all',
                'duration-150'
            );

            const innerSVGs = copyElement.querySelectorAll('svg, path');
            innerSVGs.forEach(svg => {
                svg.style.setProperty('stroke', '#ffffff', 'important');
            });

            setTimeout(() => {
                copyElement.classList.remove(
                    '!bg-emerald-500',
                    '!text-white',
                    'scale-[1.02]',
                    'shadow-sm'
                );
                innerSVGs.forEach(svg => {
                    svg.style.removeProperty('stroke');
                });
            }, 200);

        }).catch(err => {
            console.error('Критический сбой работы универсального буфера обмена:', err);
        });
    });
});
