const form = document.getElementById("qr-form");
const linkInput = document.getElementById("link");
const qrCodeContainer = document.getElementById("qr-code-container");
const statusMessage = document.getElementById("status");
const qrCode = new Image();
qrCode.alt = "Generated QR code";
qrCode.hidden = true;

/* Copilot asked to help rewrite to use fetch() */

let activeRequest;
let qrCodeObjectUrl;

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const apiUrl = new URL("https://api.qrserver.com/v1/create-qr-code/");
    apiUrl.searchParams.set("size", "210x210");
    apiUrl.searchParams.set("data", linkInput.value);

    if (activeRequest) {
        activeRequest.abort();
    }

    const request = new AbortController();
    activeRequest = request;
    qrCode.hidden = true;
    statusMessage.textContent = "Generating QR code...";

    try {
        const response = await fetch(apiUrl.href, {
            signal: request.signal,
        });

        if (!response.ok) {
            throw new Error(`QR code request failed with status ${response.status}`);
        }

        const imageBlob = await response.blob();
        const nextObjectUrl = URL.createObjectURL(imageBlob);

        qrCode.onload = () => {
            qrCode.hidden = false;
            statusMessage.textContent = "QR code successfully generated!";
            if (qrCodeObjectUrl) {
                URL.revokeObjectURL(qrCodeObjectUrl);
            }
            qrCodeObjectUrl = nextObjectUrl;
        };
        qrCode.onerror = () => {
            URL.revokeObjectURL(nextObjectUrl);
            statusMessage.textContent = "Error generating QR code. Please try again.";
        };

        qrCode.src = nextObjectUrl;
        qrCodeContainer.replaceChildren(qrCode);
    } catch (error) {
        if (error.name !== "AbortError") {
            statusMessage.textContent = "Error generating QR code. Please try again.";
        }
    } finally {
        if (activeRequest === request) {
            activeRequest = null;
        }
    }
});