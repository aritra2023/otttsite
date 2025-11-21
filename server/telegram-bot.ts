import TelegramBot from "node-telegram-bot-api";

let botInstance: TelegramBot | null = null;

export function initTelegramBot(token: string) {
  if (botInstance) {
    console.log("Telegram bot already initialized, reusing existing instance");
    return botInstance;
  }

  try {
    const bot = new TelegramBot(token, { polling: false });
    botInstance = bot;
    console.log("Telegram bot initialized successfully (send-only mode)!");
    return bot;
  } catch (error) {
    console.error("Failed to initialize Telegram bot:", error);
    throw error;
  }
}

export async function sendOtpToTelegram(otp: string) {
  if (!botInstance) {
    throw new Error("Telegram bot not initialized");
  }

  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChatId) {
    throw new Error("TELEGRAM_ADMIN_CHAT_ID not set. Please send /start to the bot to get your chat ID and set it in environment secrets.");
  }

  try {
    await botInstance.sendMessage(
      adminChatId,
      `🔐 *Password Reset OTP*\n\nYour OTP code is:\n\`${otp}\`\n\nThis code will expire in 10 minutes.\n⚠️ Do not share this code with anyone.`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error sending OTP to Telegram:", error);
    throw error;
  }
}
