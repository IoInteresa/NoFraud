const TelegramBot = require("node-telegram-bot-api");

const { TELEGRAM_BOT_ADMINS, TELEGRAM_BOT_TOKEN } = require("../environments");
const {
  WELCOME_MESSAGE,
  NO_ACCESS_MESSAGE,
  BUTTONS,
  ANTI_FRAUD_CONTROL_TEXT,
} = require("./consts");
const {
  getAllStatsText,
  getSheetListsText,
  getProductsControlKeyboards,
} = require("./handlers");
const { productsDao } = require("../Dao");

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.setMyCommands([{ command: "/start", description: "Запустить бота" }]);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!TELEGRAM_BOT_ADMINS.includes(chatId.toString())) {
    await bot.sendMessage(chatId, NO_ACCESS_MESSAGE);

    return;
  }

  const text = msg.text;

  switch (text) {
    case "/start":
      await bot.sendMessage(chatId, WELCOME_MESSAGE, {
        reply_markup: {
          keyboard: [[BUTTONS.stats], [BUTTONS.config], [BUTTONS.googleSheets]],
          resize_keyboard: true,
          one_time_keyboard: false,
        },
      });
      break;
    case BUTTONS.stats:
      const statsText = await getAllStatsText();

      await bot.sendMessage(chatId, statsText, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
      break;
    case BUTTONS.config:
      const keyboards = await getProductsControlKeyboards();

      bot.sendMessage(chatId, ANTI_FRAUD_CONTROL_TEXT, {
        reply_markup: {
          inline_keyboard: keyboards,
        },
        parse_mode: "HTML",
      });

      break;
    case BUTTONS.googleSheets:
      const sheetListsText = await getSheetListsText();

      await bot.sendMessage(chatId, sheetListsText, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
      break;
  }
});

bot.on("callback_query", async (callbackQuery) => {
  if (!callbackQuery.message || !callbackQuery.data) {
    return;
  }

  const { data, message } = callbackQuery;
  const chatId = message.chat.id;

  if (!TELEGRAM_BOT_ADMINS.includes(chatId.toString())) {
    await bot.sendMessage(chatId, NO_ACCESS_MESSAGE);

    return;
  }

  const fraudRegex = /(on|off)fraud:(\d+)/;
  const fraudMatch = data.match(fraudRegex);

  if (fraudMatch) {
    const [_, action, id] = fraudMatch;
    const isActivated = action === "on";

    await productsDao.setProductActivation(id, isActivated);

    const keyboards = await getProductsControlKeyboards();

    await bot.editMessageReplyMarkup(
      { inline_keyboard: keyboards },
      { chat_id: chatId, message_id: message.message_id }
    );
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

const startBot = () => {
  console.log("Tg Bot started");
};

module.exports = { startBot };
