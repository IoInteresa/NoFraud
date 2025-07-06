const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

const { verificationDao, productsDao } = require("../Dao");
const {
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_PRIVATE_KEY,
  GOOGLE_SHEET_EMAIL,
} = require("../environments");

const getAllStatsText = async () => {
  const verifications = await verificationDao.getAllVerifications();

  const total = verifications.length;
  const verified = verifications.filter((v) => v.isVerified).length;
  const uniquePhones = new Set(verifications.map((v) => v.phoneNumber)).size;

  return `📊 Статистика верификаций:\n
Количество запросов на верификацию: ${total}
Количество успешно пройденных верификаций: ${verified}
Количество уникальных номеров телефонов: ${uniquePhones}`;
};

const getSheetListsText = async () => {
  const formattedPrivateKey = GOOGLE_SHEET_PRIVATE_KEY.replace(/\\n/g, "\n");

  const authClient = new JWT({
    email: GOOGLE_SHEET_EMAIL,
    key: formattedPrivateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, authClient);
  await doc.loadInfo();

  let sheetsListMessage = "";

  doc.sheetsByIndex.forEach((sheet) => {
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}#gid=${sheet.sheetId}`;

    sheetsListMessage += `Название листа: ${sheet.title} - [ссылка](${sheetUrl})\n`;
  });

  return sheetsListMessage;
};

const getProductsControlKeyboards = async () => {
  const products = await productsDao.getAllProducts();

  return products.map(({ id, isActive, name }) => [
    {
      text: isActive ? `✅ ${name}` : name,
      callback_data: isActive ? `offfraud:${id}` : `onfraud:${id}`,
    },
  ]);
};

module.exports = {
  getAllStatsText,
  getSheetListsText,
  getProductsControlKeyboards,
};
