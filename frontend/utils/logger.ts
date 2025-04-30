/**
 * Simple and effective logger utility
 */

import axios from "axios";

// Log levels for different types of messages
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

// Simple log data interface
export interface LogData {
  [key: string]: any;
}

/**
 * Logger class for sending events to webhook endpoint
 */
class Logger {
  private url: string;
  private token: string;
  private enabled: boolean;
  private defaultLevel: LogLevel;

  constructor() {
    this.url =
      process.env.PUBLIC_WEBHOOK_LOG_URL ||
      "https://logger.ledinhcuong.com/api/webhook";
    this.token = process.env.PUBLIC_WEBHOOK_LOG_TOKEN || "your_token_here";
    this.enabled = process.env.NODE_ENV !== "test"; // Disable in test environment
    this.defaultLevel = LogLevel.INFO;
  }

  /**
   * Log an event with optional data without waiting for response
   */
  logEvent(event: string, data: LogData = {}, level = this.defaultLevel): void {
    if (!this.enabled) return;

    // Fire and forget - don't wait for the response
    axios
      .post(
        this.url,
        { event, data, level },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Token": this.token,
          },
        }
      )
      .then(() => {
        console.log("Logger success:", { event, data, level });
      })
      .catch((error) => {
        if (level !== LogLevel.ERROR) {
          console.error(
            "Logger error:",
            error instanceof Error ? error.message : String(error)
          );
        }
      });
  }

  /**
   * Log debug message
   */
  debug(event: string, data: LogData = {}): void {
    this.logEvent(event, data, LogLevel.DEBUG);
  }

  /**
   * Log info message
   */
  info(event: string, data: LogData = {}): void {
    this.logEvent(event, data, LogLevel.INFO);
  }

  /**
   * Log warning message
   */
  warn(event: string, data: LogData = {}): void {
    this.logEvent(event, data, LogLevel.WARN);
  }

  /**
   * Log error message
   */
  error(event: string, data: LogData = {}): void {
    this.logEvent(event, data, LogLevel.ERROR);
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;
