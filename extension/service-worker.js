// service-worker.js

// 🚨 IMPORTANT: Replace with your actual key
const GEMINI_API_KEY = "AIzaSyDJYfvEmaGjhvrpPso52TNpPMiItGRt0y4"; 

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.action === "generateGift") {
            try {
                // Use a simple fetch call (or the SDK if installed)
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: request.prompt }]
                            }],
                            config: {
                                temperature: 0.8
                            }
                        }),
                    }
                );

                const data = await response.json();
                const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating gift.";
                
                // Send the result back to the popup
                sendResponse({ success: true, gift: generatedText });

            } catch (error) {
                console.error("Gemini API Error:", error);
                sendResponse({ success: false, gift: "Sorry, the ghost is too tired to generate a gift right now." });
            }
            return true; // Indicates asynchronous response
        }
    }
);