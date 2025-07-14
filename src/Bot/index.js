const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");

const { TELEGRAM_BOT_ADMINS, TELEGRAM_BOT_TOKEN } = require("../environments");
const {
  WELCOME_MESSAGE,
  NO_ACCESS_MESSAGE,
  BUTTONS,
  ANTI_FRAUD_CONTROL_TEXT,
} = require("./consts");
const {
  getAllStatsText,
  getProductsControlKeyboards,
  sendDailyEventsStat,
} = require("./handlers");
const { productService } = require("../Services");

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

    await productService.setActive({ productId: id, value: isActivated });

    const keyboards = await getProductsControlKeyboards();

    await bot.editMessageReplyMarkup(
      { inline_keyboard: keyboards },
      { chat_id: chatId, message_id: message.message_id }
    );
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

cron.schedule("0 16 * * *", async () => {
  const adminsId = TELEGRAM_BOT_ADMINS.split(",");

  const text = await sendDailyEventsStat();

  adminsId.forEach((id) => {
    bot.sendMessage(Number(id), text, { parse_mode: "HTML" });
  });
});

const startBot = () => {
  console.log("Tg Bot started");
};

module.exports = { startBot };
