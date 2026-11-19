const form = document.getElementById("qr-form");
const linkInput = document.getElementById("link");
const qrCodeContainer = document.getElementById("qr-code-container");
const statusMessage = document.getElementById("status");
const qrCode = new Image();
qrCode.alt = "Generated QR code";
qrCode.hidden = true;

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const apiUrl = new URL("https://qrtag.net/api/qr_6.png");
    apiUrl.searchParams.set("url", linkInput.value);

    qrCode.hidden = true;
    statusMessage.textContent = "Generating QR code...";

    qrCode.onload = () => {
        qrCode.hidden = false;
        statusMessage.textContent = "QR code successfully generated!";
    };
    qrCode.onerror = () => {
        statusMessage.textContent = "Error generating QR code. Please try again.";
    };

    qrCode.src = apiUrl.href;
    qrCodeContainer.replaceChildren(qrCode);
});