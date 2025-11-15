document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Variable Declarations & Selectors ---
    const gravestone = document.getElementById("gravestone");
    const ghostContainer = document.getElementById("ghost-container"); 
    const ghost = document.getElementById("ghost");
    const menu = document.getElementById("menu");
    const ALL_MODAL_SELECTORS = ".mailbox-background, .dressing-background, .gifts-background, .haunt-background";


    // --- 2. Helper Functions for Modals ---

    // Closes ALL modals by selecting every element with a background class
    function closeAllModals() {
        document.querySelectorAll(ALL_MODAL_SELECTORS)
            .forEach(m => m.classList.add("hidden"));
    }

    // Opens a modal: closes all others first, then shows the target modal
    function openModal(modalId) {
        closeAllModals(); 
        document.getElementById(modalId).classList.remove("hidden");
    }


    // --- 3. Gravestone Toggle Logic ---
    gravestone.addEventListener("click", () => {
        // Check visibility of the ghost's container (assuming it's what toggles the state)
        const isGhostVisible = !ghostContainer.classList.contains("hidden");

        if (!isGhostVisible) {
            // ACTION: WAKE UP
            if (typeof wake === 'function') {
                wake();
            }
            
            // UI Changes: SHOW ghost and menu
            ghostContainer.classList.remove("hidden");
            menu.classList.remove("hidden");
            
            // Apply animations
            ghost.classList.add("shake", "glow", "float");
            setTimeout(() => {
                ghost.classList.remove("shake");
            }, 500);

        } else {
            // ACTION: GO TO SLEEP
            if (typeof sleep === 'function') {
                sleep();
            }
            
            // UI Changes: HIDE ghost and menu
            closeAllModals(); // Close any open modals first
            ghostContainer.classList.add("hidden");
            menu.classList.add("hidden");
            
            // Remove lingering animation classes
            ghost.classList.remove("glow", "float");
        }
    });


    // --- 4. Dressing Room / Ghost Outfit Logic ---
    const ghostImg = document.getElementById("ghost");

    let currentHat = null;
    let currentGlasses = null;

    function updateGhostImage() {
        // Start with the base ghost image
        let src = "icons/ghost.png";

        // Build the source string based on selected accessories
        if (currentHat && currentGlasses) {
            src = `icons/ghost+${currentHat}+${currentGlasses}.png`;
        } else if (currentHat) {
            src = `icons/ghost+${currentHat}.png`;
        } else if (currentGlasses) {
            src = `icons/ghost+${currentGlasses}.png`;
        }

        ghostImg.src = src;
    }

    document.querySelectorAll(".dress-item").forEach(btn => {
        btn.addEventListener("click", () => {
            // NOTE: Requires data-type="hat" or data-type="glasses" on the HTML button
            const type = btn.dataset.type; 
            const id = btn.dataset.id; // e.g., hat1, glasses1

            if (type === "hat") {
                currentHat = (currentHat === id) ? null : id; // Toggle logic
            } else if (type === "glasses") {
                currentGlasses = (currentGlasses === id) ? null : id; // Toggle logic
            }

            updateGhostImage();
        });
    });
    
    // --- 5. Menu Button Toggle Logic (Master Logic) ---

    // Function to set up the open/close toggle behavior for a single button
    function setupModalToggle(buttonId, modalId) {
        document.getElementById(buttonId).addEventListener("click", () => {
            const modal = document.getElementById(modalId);
            
            // Check if THIS specific modal is currently open
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

    // Attach the toggle logic to all your menu buttons
    setupModalToggle("mailbox", "mailbox-modal");
    setupModalToggle("dressing", "dressing-modal");
    setupModalToggle("gifts", "gifts-modal");
    setupModalToggle("haunt", "haunt-modal");


    // --- 6. Close Buttons (Generalized Logic) ---
    // When any button with the class 'close-btn' is clicked, it closes ALL modals.
    document.querySelectorAll(".close-btn").forEach(btn => btn.addEventListener("click", closeAllModals));
});