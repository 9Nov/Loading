document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Navigation ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Update button active state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update content active state
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // --- Google Sheet API URL ---
    // IMPORTANT: Replace this with your own deployed Google Apps Script URL
    const API_URL = 'https://script.google.com/macros/s/AKfycbx-pP32-3_g_6-y62-s-E3U4B-w_1-R_9-y8-Y_7-T_5-E_3-A_2-u_1-B_0-c_1-B_2-c_3-B_4-d_5-e_6-f_7-g_8-h_9-i_0-j/exec';

    // --- QR Code Scanning ---
    const scanResultDiv = document.getElementById('scanResult');

    function onScanSuccess(decodedText, decodedResult) {
        // Handle the scanned code here.
        console.log(`Code matched = ${decodedText}`, decodedResult);

        // Stop scanning after a successful scan.
        html5QrcodeScanner.clear();

        scanResultDiv.innerHTML = `<p>Processing...</p>`;

        // Send the scanned QR code to the Google Sheet
        fetch(`${API_URL}?qrCode=${decodedText}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    scanResultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
                } else {
                    scanResultDiv.innerHTML = `
                        <p><strong>Scan Successful!</strong></p>
                        <p><strong>Item:</strong> ${data.item}</p>
                        <p><strong>Remaining:</strong> ${data.remaining}</p>
                    `;
                }
            })
            .catch(error => {
                scanResultDiv.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
            });
    }

    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${error}`);
    }

    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);


    // --- QR Code Generation ---
    const qrTextInput = document.getElementById('qrTextInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrCodeContainer = document.getElementById('qrcode');

    generateBtn.addEventListener('click', () => {
        const text = qrTextInput.value.trim();
        if (text) {
            qrCodeContainer.innerHTML = ''; // Clear previous QR code
            try {
                // By setting typeNumber to 0, the library will automatically select the smallest
                // QR code version that fits the data. This allows for longer text and non-ASCII characters.
                const typeNumber = 0;
                const errorCorrectionLevel = 'L';
                const qr = qrcode(typeNumber, errorCorrectionLevel);
                qr.addData(text);
                qr.make();
                // Using a smaller cell size to ensure larger QR codes can fit in the container.
                qrCodeContainer.innerHTML = qr.createImgTag(4, 8); // (cellSize, margin)
            } catch (e) {
                qrCodeContainer.innerHTML = `<p style="color: red;">Could not generate QR code. The text may be too long.</p>`;
            }
        } else {
            qrCodeContainer.innerHTML = `<p style="color: orange;">Please enter text to generate a QR code.</p>`;
        }
    });
});
