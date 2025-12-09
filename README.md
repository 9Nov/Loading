# Sticker Inventory Tracker

This is a simple web application for tracking sticker usage by scanning QR codes. The application is responsive and features a pastel color scheme.

## How It Works

The application allows you to enter a QR code, which is then sent to a Google Apps Script. The script searches for the QR code in a Google Sheet, and if a match is found, it updates the "Used" count and returns the item name and the remaining stock.

## Setup

### 1. Google Sheet

- Make a copy of the [Google Sheet template](https://docs.google.com/spreadsheets/d/1qZSLhFloTwjB1XlcEIfDAmi3n0WXY8p93xQWNB6Bn20/edit?usp=sharing).
- The sheet has a "Stock" tab with the following columns: `ID`, `Items`, `Stock`, `Used`, `คงเหลือ`, and `QR Code`.

### 2. Google Apps Script

- Open your copy of the Google Sheet and go to **Extensions > Apps Script**.
- Copy the code from `google_apps_script.gs` and paste it into the script editor, replacing any existing code.
- **Deploy the script:**
  1. Click **Deploy > New deployment**.
  2. For **Select type**, choose **Web app**.
  3. In the **Description** field, enter a description (e.g., "Sticker Tracker").
  4. For **Who has access**, select **Anyone** (or **Anyone with a Google account** if you want to restrict access).
  5. Click **Deploy**.
  6. **Authorize access** when prompted.
- **Copy the Web app URL**. You will need this for the next step.

### 3. Frontend

- Open `script.js` and replace the `API_URL` with the URL of your deployed Google Apps Script.
- Open `index.html` in your web browser to use the application.

## Usage

1. Open `index.html` in a web browser.
2. Enter a QR code in the text input field.
3. Click **Submit**.
4. The application will display the item name and the remaining stock.
