function doGet(e) {
  const qrCode = e.parameter.qrCode;

  if (!qrCode) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'QR code is missing.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Get the active spreadsheet and the "Stock" sheet.
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName("Stock");
    const data = sheet.getDataRange().getValues();
    let found = false;
    let item, remaining;

    for (let i = 1; i < data.length; i++) {
      if (data[i][5] == qrCode) { // Column F is index 5
        let used = data[i][3] || 0; // Column D is index 3
        sheet.getRange(i + 1, 4).setValue(used + 1);

        item = data[i][1]; // Column B is index 1
        let stock = data[i][2];
        remaining = stock - (used + 1);

        found = true;
        break;
      }
    }

    if (found) {
      return ContentService.createTextOutput(JSON.stringify({ item: item, remaining: remaining }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ error: 'QR code not found.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'An error occurred: ' + error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
