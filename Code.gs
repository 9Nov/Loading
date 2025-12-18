// The spreadsheet ID and sheet names
const SPREADSHEET_ID = "1y1YbK9KVxnr2YEKdDTdrVFFhySxhDtUv2DJtwnzSkvA";
const STOCK_SHEET_NAME = "Stock";
const STOCK_IN_LOG_SHEET_NAME = "บันทึกรับเข้า";
const STOCK_OUT_LOG_SHEET_NAME = "บันทึกเบิกออก";

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index.html')
      .setTitle('Stock Management App');
}

/**
 * Records a stock-in transaction.
 * @param {string} itemName The name of the item.
 * @param {number} quantity The quantity received.
 * @returns {object} A result object with status and message.
 */
function recordStockIn(itemName, quantity) {
  try {
    const sheetId = SPREADSHEET_ID;
    const stockSheet = SpreadsheetApp.openById(sheetId).getSheetByName(STOCK_SHEET_NAME);
    const logSheet = SpreadsheetApp.openById(sheetId).getSheetByName(STOCK_IN_LOG_SHEET_NAME);

    // 1. Log the transaction
    const timestamp = new Date();
    logSheet.appendRow([timestamp, itemName, quantity]);

    // 2. Update the Stock sheet
    const dataRange = stockSheet.getRange("A2:A" + stockSheet.getLastRow());
    const itemCodes = dataRange.getValues().flat();
    const itemIndex = itemCodes.indexOf(itemName);

    if (itemIndex !== -1) {
      // Item exists: update the "ยอดรับเข้า" (column C)
      const rowIndex = itemIndex + 2; // +2 because range starts at row 2
      const currentStockInCell = stockSheet.getRange(rowIndex, 3);
      const currentStockIn = currentStockInCell.getValue() || 0;
      currentStockInCell.setValue(currentStockIn + quantity);
    } else {
      // Item does not exist: add a new row
      // Columns: A (รหัส), B (รายการ), C (ยอดรับเข้า), D (ยอดเบิกออกรวม)
      stockSheet.appendRow([itemName, '', quantity, 0]);
    }

    return { status: "success", message: "ทำรายการสำเร็จ" };
  } catch (e) {
    return { status: "error", message: e.message };
  }
}

/**
 * Retrieves details for a given item code from the Stock sheet.
 * @param {string} itemCode The item code to search for.
 * @returns {object} A result object with item details or an error.
 */
function getItemDetails(itemCode) {
  try {
    const sheetId = SPREADSHEET_ID;
    const stockSheet = SpreadsheetApp.openById(sheetId).getSheetByName(STOCK_SHEET_NAME);
    const dataRange = stockSheet.getRange("A2:E" + stockSheet.getLastRow());
    const values = dataRange.getValues();

    for (let i = 0; i < values.length; i++) {
      if (values[i][0] == itemCode) { // Column A is the item code
        const remainingQuantity = values[i][4]; // Column E is "ยอดคงเหลือ"
        return {
          status: "success",
          itemCode: itemCode,
          remainingQuantity: remainingQuantity,
        };
      }
    }

    return { status: "error", message: "ไม่พบ Items ที่ต้องการค้นหา" };
  } catch (e) {
    return { status: "error", message: e.message };
  }
}

/**
 * Records a stock-out transaction.
 * @param {string} itemCode The item code being withdrawn.
 * @param {number} quantity The quantity to withdraw.
 * @returns {object} A result object with status and message.
 */
function recordStockOut(itemCode, quantity) {
  try {
    const sheetId = SPREADSHEET_ID;
    const stockSheet = SpreadsheetApp.openById(sheetId).getSheetByName(STOCK_SHEET_NAME);
    const logSheet = SpreadsheetApp.openById(sheetId).getSheetByName(STOCK_OUT_LOG_SHEET_NAME);

    // First, find the item to ensure it exists and check stock
    const dataRange = stockSheet.getRange("A2:E" + stockSheet.getLastRow());
    const values = dataRange.getValues();
    let itemIndex = -1;
    let remainingQuantity = 0;

    for (let i = 0; i < values.length; i++) {
        if (values[i][0] == itemCode) {
            itemIndex = i;
            remainingQuantity = values[i][4]; // Column E
            break;
        }
    }

    if (itemIndex === -1) {
      return { status: "error", message: "ไม่พบ Items ที่ต้องการค้นหา" };
    }

    if (quantity > remainingQuantity) {
      return { status: "error", message: "จำนวนเบิกออกมากกว่าของที่เหลือ" };
    }

    // 1. Log the transaction
    const timestamp = new Date();
    logSheet.appendRow([timestamp, itemCode, quantity]);

    // 2. Update the "ยอดเบิกออกรวม" (column D) in the Stock sheet
    const rowIndex = itemIndex + 2; // +2 because range starts at row 2
    const currentStockOutCell = stockSheet.getRange(rowIndex, 4);
    const currentStockOut = currentStockOutCell.getValue() || 0;
    currentStockOutCell.setValue(currentStockOut + quantity);

    return { status: "success", message: "ทำรายการสำเร็จ" };
  } catch (e) {
    return { status: "error", message: e.message };
  }
}
