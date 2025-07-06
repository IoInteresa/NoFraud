const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

const {
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_PRIVATE_KEY,
  GOOGLE_SHEET_EMAIL,
} = require("../environments");
const { GOOGLE_SHEET_LIST_KEYS } = require("../Constants");
const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");

class GoogleSheetManager {
  sheet = null;

  async initialize(listName) {
    const formattedPrivateKey = GOOGLE_SHEET_PRIVATE_KEY.replace(/\\n/g, "\n");

    const authClient = new JWT({
      email: GOOGLE_SHEET_EMAIL,
      key: formattedPrivateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, authClient);
    await doc.loadInfo();

    this.sheet = doc.sheetsByTitle[listName];

    if (!this.sheet) {
      this.sheet = await doc.addSheet({
        title: listName,
        headerValues: GOOGLE_SHEET_LIST_KEYS,
      });
    }
  }

  async addRow(data) {
    if (!this.sheet) {
      throw new ThrowError(
        HttpStatus.SHEET_LIST_NOT_FOUND,
        "Sheet not initialized"
      );
    }

    await this.sheet.addRow(data);

    return data.id;
  }

  async updateConfirmed(id) {
    if (!this.sheet) {
      throw new ThrowError(
        HttpStatus.SHEET_LIST_NOT_FOUND,
        "Sheet not initialized"
      );
    }

    const rows = await this.sheet.getRows();

    const rowToUpdate = rows.find((row) => row.get("id") === id);
    if (!rowToUpdate) {
      throw new ThrowError(
        HttpStatus.SHEET_ROW_NOT_FOUND,
        "Sheet row not found"
      );
    }

    rowToUpdate.set("confirmed", true);

    await rowToUpdate.save();
  }
}

module.exports = GoogleSheetManager;
