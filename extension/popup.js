document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Variable Declarations & Selectors ---
    const gravestone = document.getElementById("gravestone");
    const ghostContainer = document.getElementById("ghost-container");
    const ghostVisContainer = document.getElementById("popup-content"); // Visibility container
    const ghostImg = document.getElementById("ghost"); // Image element
    const menu = document.getElementById("menu");
    const ALL_MODAL_SELECTORS = ".mailbox-background, .dressing-background, .gifts-background, .haunt-background";


    // --- 2. Helper Functions for Modals ---

    function closeAllModals() {
        document.querySelectorAll(ALL_MODAL_SELECTORS)
            .forEach(m => m.classList.add("hidden"));
    }

    function openModal(modalId) {
        closeAllModals();
        document.getElementById(modalId).classList.remove("hidden");
    }

    // Function to set up the open/close toggle behavior for a single button
    function setupModalToggle(buttonId, modalId) {
        document.getElementById(buttonId).addEventListener("click", () => {
            const modal = document.getElementById(modalId);

            // Check if THIS specific modal is currently open (NOT hidden)
            const isAlreadyOpen = !modal.classList.contains("hidden");

            if (isAlreadyOpen) {
                // If it's open, CLOSE it.
                modal.classList.add("hidden");
            } else {
                // If it's closed, OPEN it (uses openModal, which closes all others first)
                openModal(modalId);
            }
        });
    }


    // --- 3. Gravestone Toggle Logic (FIXED) ---
    gravestone.addEventListener("click", () => {
        const isGhostVisible = !ghostVisContainer.classList.contains("hidden");
        if (!isGhostVisible) {
            // WAKE UP
            if (typeof wake === 'function') {
                wake(ghostVisContainer, ghostImg, menu);
            }
        } else {
            // GO TO SLEEP
            if (typeof sleep === 'function') {
                sleep(ghostVisContainer, menu);
            }
        }
        // 🛑 REMOVED: menu.classList.add("hidden"); 
    });


    // --- 4. Dressing Room / Ghost Outfit Logic ---
    let currentHat = null;
    let currentGlasses = null;

    function updateGhostImage() {
        let parts = ["ghost"];

        if (currentHat) parts.push(currentHat);
        if (currentGlasses) parts.push(currentGlasses);

        ghostImg.src = "icons/" + parts.join("+") + ".png";
    }

    document.querySelectorAll(".dress-item").forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.type;
            const id = button.dataset.id;

            if (type === "hat") {
                currentHat = (currentHat === id ? null : id);
            }
            if (type === "glasses") {
                currentGlasses = (currentGlasses === id ? null : id);
            }
            updateGhostImage();
        });
    });

    // --- 5. Menu Button Toggle Logic (FIXED) ---
    // Now use the setupModalToggle function for all menu buttons
    setupModalToggle("mailbox", "mailbox-modal");
    setupModalToggle("dressing", "dressing-modal");
    setupModalToggle("gifts", "gifts-modal");
    setupModalToggle("haunt", "haunt-modal");

    // Close buttons
    document.querySelectorAll(".close-btn").forEach(btn => btn.addEventListener("click", closeAllModals));

    // --- 6. Playing sounds when hovering over menu options
    // Create audio objects
    const sounds = {
        mailbox: new Audio("sounds/mail.mp3"),
        dressing: new Audio("sounds/dresser.mp3"),
        gifts: new Audio("sounds/gift.mp3"),
        haunt: new Audio("sounds/haunt.mp3"),
        gravestone: new Audio("sounds/gravestone.mp3"), 
        ghost: new Audio("sounds/ghost.mp3")
    };

    // Play sound on hover, stop on leave
    Object.keys(sounds).forEach(id => {
        const btn = document.getElementById(id);

        btn.addEventListener("mouseenter", () => {
            sounds[id].currentTime = 0; // restart if already playing
            sounds[id].play();
        });

        btn.addEventListener("mouseleave", () => {
            sounds[id].pause();
            sounds[id].currentTime = 0; // reset to start
        });
    });
});