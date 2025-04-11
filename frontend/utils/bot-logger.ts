import axios from "axios";

interface LogOptions {
  content?: string;
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: any;
    inline?: boolean;
  }>;
}

class TelegramLogger {
  private botToken: string;
  private chatId: string;
  private readonly TELEGRAM_MAX_MESSAGE_LENGTH = 4096; // Telegram API limit

  constructor() {
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (!botToken) {
      throw new Error(
        "NEXT_PUBLIC_TELEGRAM_BOT_TOKEN is not defined in environment variables"
      );
    }

    if (!chatId) {
      throw new Error(
        "NEXT_PUBLIC_TELEGRAM_CHAT_ID is not defined in environment variables"
      );
    }

    this.botToken = botToken;
    this.chatId = chatId;
  }

  private formatValue(value: any): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return value;

    if (value instanceof Error) {
      return `${value.message}\n${value.stack || ""}`;
    }

    if (value instanceof Map || value instanceof Set) {
      try {
        return JSON.stringify(Array.from(value), null, 2);
      } catch (error) {
        return String(value);
      }
    }

    if (typeof value === "function") {
      return `[Function: ${value.name || "anonymous"}]`;
    }

    if (typeof value === "symbol") {
      return value.toString();
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
      return `[Binary data of length: ${value.byteLength}]`;
    }

    try {
      // Create a Set to track seen objects (for circular reference detection)
      const seen = new Set();

      const serialized = JSON.stringify(
        value,
        (key, val) => {
          // Handle circular references
          if (typeof val === "object" && val !== null) {
            if (seen.has(val)) return "[Circular Reference]";
            seen.add(val);
          }
          // Handle any other special cases
          if (val instanceof RegExp) return val.toString();
          return val;
        },
        2
      );

      return serialized;
    } catch (error) {
      try {
        return String(value);
      } catch (stringError) {
        return "[Unstringifiable Object]";
      }
    }
  }

  // Escape special characters for MarkdownV2
  // private escapeMdV2(text: string): string {
  //   if (!text) return "";

  //   // Characters that need escaping in MarkdownV2: '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'
  //   return text
  //     .replace(/([_*[\]()~`>#+=|{}.!\\])/g, "\\$1")
  //     .replace(/```/g, "\\`\\`\\`"); // Special case for code blocks
  // }

  private async sendChunkedMessage(message: string) {
    // Split message into chunks that respect the Telegram message limit
    const chunks = [];
    let currentChunk = "";

    // Split by double newlines to preserve formatting
    const paragraphs = message.split("\n\n");

    for (const paragraph of paragraphs) {
      // If a single paragraph is longer than the limit, split it
      if (paragraph.length > this.TELEGRAM_MAX_MESSAGE_LENGTH) {
        let remainingText = paragraph;
        while (remainingText.length > 0) {
          const chunk = remainingText.substring(
            0,
            this.TELEGRAM_MAX_MESSAGE_LENGTH
          );
          chunks.push(chunk);
          remainingText = remainingText.substring(
            this.TELEGRAM_MAX_MESSAGE_LENGTH
          );
        }
        continue;
      }

      // If adding this paragraph would exceed the limit, create a new chunk
      if (
        currentChunk.length + paragraph.length + 2 >
        this.TELEGRAM_MAX_MESSAGE_LENGTH
      ) {
        chunks.push(currentChunk);
        currentChunk = paragraph;
      } else {
        // Add paragraph to current chunk
        if (currentChunk.length > 0) {
          currentChunk += "\n\n" + paragraph;
        } else {
          currentChunk = paragraph;
        }
      }
    }

    // Add the final chunk if it's not empty
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    // Send each chunk
    for (const chunk of chunks) {
      await this.sendSingleMessage(chunk);
    }
  }

  private async sendSingleMessage(message: string) {
    const maxRetries = 3;
    let attempt = 0;
    let delay = 100; // Initial delay in ms

    while (attempt < maxRetries) {
      try {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        const payload = {
          chat_id: this.chatId,
          text: message,
          parse_mode: "HTML", // Changed from Markdown to HTML
          disable_web_page_preview: true,
        };

        const response = await axios.post(url, payload);

        if (response.status !== 200) {
          console.warn(
            "Telegram request response:",
            response.status,
            response.statusText
          );
        }

        // Successfully sent, exit the retry loop
        return;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          // Handle rate limiting
          attempt++;

          // Get retry delay from Telegram response or use exponential backoff
          const retryAfter = error.response.data?.parameters?.retry_after || 1;
          const waitTime = retryAfter * 1000 || delay;

          console.warn(
            `Telegram rate limited. Retrying in ${waitTime}ms. Attempt ${attempt}/${maxRetries}`
          );

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, waitTime));

          // Exponential backoff for next attempt if needed
          delay *= 2;
        } else {
          // For non-rate-limit errors, log and exit retry loop
          if (axios.isAxiosError(error)) {
            console.error("Telegram request error:", {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
            });
          } else {
            console.error("Failed to send log to Telegram:", error);
          }
          return;
        }
      }
    }

    // If we've exhausted all retries
    console.error(
      `Failed to send Telegram message after ${maxRetries} attempts due to rate limiting`
    );
  }

  private async sendToTelegram(options: LogOptions) {
    try {
      // Format the message with HTML
      let message = "";

      // Add title if present
      if (options.title) {
        message += `<b>${options.title}</b>\n\n`;
      }

      // Add description if present
      if (options.description) {
        message += `${options.description}\n\n`;
      }

      // Add fields if present
      if (options.fields && options.fields.length > 0) {
        for (const field of options.fields) {
          message += `<b>${field.name}</b>\n${this.formatValue(
            field.value
          )}\n\n`;
        }
      }

      // Send the message, handling chunking if needed
      await this.sendChunkedMessage(message);
    } catch (error) {
      console.error("Error preparing or sending Telegram message:", error);
    }
  }

  async info(message: string, details?: Record<string, any>) {
    await this.sendToTelegram({
      title: "📝 Info Log",
      description: message,
      color: 0x0099ff,
      fields: details
        ? Object.entries(details).map(([key, value]) => ({
            name: key,
            value: value,
            inline: false,
          }))
        : undefined,
    });
  }

  async error(error: Error | string, details?: Record<string, any>) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    const fields = [];

    if (errorStack) {
      fields.push({
        name: "Stack Trace",
        value: `<pre>${errorStack}</pre>`,
        inline: false,
      });
    }

    if (details) {
      fields.push(
        ...Object.entries(details).map(([key, value]) => ({
          name: key,
          value: value,
          inline: false,
        }))
      );
    }

    await this.sendToTelegram({
      title: "❌ Error Log",
      description: errorMessage,
      color: 0xff0000,
      fields,
    });
  }

  async warn(message: string, details?: Record<string, any>) {
    await this.sendToTelegram({
      title: "⚠️ Warning Log",
      description: message,
      color: 0xffa500,
      fields: details
        ? Object.entries(details).map(([key, value]) => ({
            name: key,
            value: value,
            inline: false,
          }))
        : undefined,
    });
  }
}

// Create a singleton instance
export const botLogger = new TelegramLogger();
