
// Use your real IP + port here
const SERVER_URL = "ws://66.42.80.193:3000";

let socket = null;
let ghost = null;

// Connect to the WebSocket server (with simple reconnect)
function connectSocket() {
    if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
         socket.readyState === WebSocket.CONNECTING)
    ) {
        return; // already connected or connecting
    }

    console.log("[JustABooAway] Connecting WebSocket to", SERVER_URL);
    socket = new WebSocket(SERVER_URL);

    socket.addEventListener("open", () => {
        console.log("[JustABooAway] WebSocket OPEN");
        // 👇 IMPORTANT: we do NOT call addGhost() here anymore,
        // so the ghost starts hidden.
    });

    // Single message handler: react to pet-action messages
    socket.addEventListener("message", (event) => {
        console.log("[JustABooAway] WebSocket MESSAGE:", event.data);

        let data;
        try {
            data = JSON.parse(event.data);
        } catch {
            return;
        }

        // Server forwards: { type: 'pet-action', action: 'show-ghost' | 'hide-ghost', ... }
        if (data.type === "pet-action") {
            if (data.action === "show-ghost") {
                // Show ghost here, but don't rebroadcast
                addGhost(false);
            } else if (data.action === "hide-ghost") {
                // Hide ghost here, but don't rebroadcast
                removeGhost(false);
            }
        }
    });

    socket.addEventListener("error", (err) => {
        console.error("[JustABooAway] WebSocket ERROR:", err);
    });

    socket.addEventListener("close", () => {
        console.log("[JustABooAway] WebSocket CLOSED");
        // basic auto-reconnect
        setTimeout(() => {
            console.log("[JustABooAway] Reconnecting WebSocket...");
            connectSocket();
        }, 5000);
    });
}

// Send an action to the server so the *other* user updates
function sendPetAction(action, payload = {}) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("[JustABooAway] Cannot send pet action, socket not open");
        return;
    }

    const msg = {
        type: "pet-action",
        action,
        payload,
    };
    socket.send(JSON.stringify(msg));
    console.log("[JustABooAway] Sent pet-action:", msg);
}

// =====================
//  Ghost overlay
// =====================

function addGhost(broadcast = true) {
    if (ghost) return;

    ghost = document.createElement("img");
    ghost.id = "ghost-overlay";
    ghost.src = chrome.runtime.getURL("icons/ghost.png");

    ghost.style.position = "fixed";
    ghost.style.bottom = "20px";
    ghost.style.right = "20px";
    ghost.style.width = "120px";
    ghost.style.zIndex = "999999999";
    ghost.style.pointerEvents = "none";

    document.body.appendChild(ghost);
    console.log("[JustABooAway] Ghost added");

    if (broadcast) {
        // tell the server so the other user shows the ghost too
        sendPetAction("show-ghost");
    }
}

function removeGhost(broadcast = true) {
    if (!ghost) return;

    ghost.remove();
    ghost = null;
    console.log("[JustABooAway] Ghost removed");

    if (broadcast) {
        // tell the server so the other user hides the ghost too
        sendPetAction("hide-ghost");
    }
}

// =====================
//  Message from popup
// =====================

chrome.runtime.onMessage.addListener((msg) => {
    console.log("[JustABooAway] onMessage:", msg);

    if (msg.action === "toggleGhost") {
        // make sure socket is connected before we broadcast
        connectSocket();

        if (ghost) {
            // currently visible → hide everywhere
            removeGhost(true);
        } else {
            // currently hidden → show everywhere
            addGhost(true);
        }
    }
});

// Optionally, connect the socket as soon as the page loads,
// but keep the ghost hidden until the first toggle.
connectSocket();