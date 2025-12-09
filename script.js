const qrCodeInput = document.getElementById('qrCodeInput');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');

const API_URL = 'https://script.google.com/macros/s/AKfycbx-pP32-3_g_6-y62-s-E3U4B-w_1-R_9-y8-Y_7-T_5-E_3-A_2-u_1-B_0-c_1-B_2-c_3-B_4-d_5-e_6-f_7-g_8-h_9-i_0-j/exec';

submitBtn.addEventListener('click', () => {
    const qrCode = qrCodeInput.value.trim();
    if (qrCode) {
        fetch(`${API_URL}?qrCode=${qrCode}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
                } else {
                    resultDiv.innerHTML = `
                        <p><strong>Item:</strong> ${data.item}</p>
                        <p><strong>Remaining:</strong> ${data.remaining}</p>
                    `;
                }
            })
            .catch(error => {
                resultDiv.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
            });
    } else {
        resultDiv.innerHTML = '<p style="color: orange;">Please enter a QR code.</p>';
    }
});
