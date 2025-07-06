const BUTTONS = {
  stats: "📊 Статистика работы фрод системы",
  config: "⚙️ Конфигурация режима работы системы",
  googleSheets: "🔗 Ссылки на Google Sheets",
};

const WELCOME_MESSAGE = "Добро пожаловать!";
const NO_ACCESS_MESSAGE = "У вас нет доступа к боту";

const ANTI_FRAUD_CONTROL_TEXT =
  "<b>Конфигурация режима работы системы</b>\n\nЕсли перед названием продукта установлена галочка, антифрод-система включена. Если галочка отсутствует, система отключена";

module.exports = {
  BUTTONS,
  WELCOME_MESSAGE,
  NO_ACCESS_MESSAGE,
  ANTI_FRAUD_CONTROL_TEXT,
};
