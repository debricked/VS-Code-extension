import * as Sentry from "@sentry/node";
import { MessageStatus } from "../constants";

export class SentryHelper {
    private static instance: SentryHelper;

    private constructor() {}

    /**
     * Initializes Sentry with the provided configuration.
     *
     * @param dsn - Your Sentry DSN.
     * @param release - The release version of your extension.
     * @param environment - The environment (e.g., production, development).
     * @param tracesSampleRate - The sample rate for capturing transactions (performance monitoring).
     */
    public static initialize(
        dsn: string,
        release: string,
        environment: string = "production",
        tracesSampleRate: number = 1.0,
    ): void {
        if (!SentryHelper.instance) {
            Sentry.init({
                dsn,
                release,
                environment,
                tracesSampleRate,
            });
            SentryHelper.instance = new SentryHelper();
        }
    }

    /**
     * Captures an exception and sends it to Sentry.
     *
     * @param error - The error object to capture.
     */
    public static captureException(error: Error): void {
        Sentry.captureException(error);
    }

    /**
     * Captures a custom message and sends it to Sentry.
     *
     * @param message - The message to capture.
     * @param level - The severity level (optional, defaults to 'info').
     */
    public static captureMessage(message: string, level: Sentry.SeverityLevel = "info"): void {
        Sentry.captureMessage(message, level);
    }

    /**
     * Captures a custom event and sends it to Sentry.
     *
     * @param event - The custom event object to capture.
     */
    public static captureEvent(event: Sentry.Event): void {
        Sentry.captureEvent(event);
    }

    /**
     * Adds a breadcrumb, which is a log or an event that happened prior to the error.
     *
     * @param message - The message for the breadcrumb.
     * @param category - The category of the breadcrumb (e.g., 'ui', 'http').
     * @param level - The severity level (optional, defaults to 'info').
     * @param data - Additional data to attach to the breadcrumb.
     */
    public static addBreadcrumb(
        message: string,
        category: string,
        level: Sentry.SeverityLevel = "info",
        data: Record<string, any> = {},
    ): void {
        Sentry.addBreadcrumb({
            message,
            category,
            level,
            data,
        });
    }

    /**
     * Sets a tag in Sentry's context.
     *
     * @param key - The key for the tag.
     * @param value - The value for the tag.
     */
    public static setTag(key: string, value: string): void {
        Sentry.setTag(key, value);
    }

    /**
     * Sets user context in Sentry.
     *
     * @param user - The user object to attach (e.g., id, username, email).
     */
    public static setUser(user: Sentry.User): void {
        Sentry.setUser(user);
    }

    /**
     * Sets extra context data in Sentry.
     *
     * @param key - The key for the extra data.
     * @param value - The value for the extra data.
     */
    public static setExtra(key: string, value: any): void {
        Sentry.setExtra(key, value);
    }

    /**
     * Closes the Sentry client gracefully, ensuring all events are sent.
     */
    public static async close(): Promise<void> {
        await Sentry.close();
    }

    /**
     * Captures a message by SeverityLevel.
     *
     * @param message - The message to capture.
     * @param level - The severity level (optional, defaults to 'info').
     */
    public static captureMessageBySeverityLevel(level: MessageStatus, message: any): void {
        switch (level) {
            case MessageStatus.FATAL:
            case MessageStatus.EXCEPTION:
                SentryHelper.captureException(message);
                break;
            case MessageStatus.WARN:
            case MessageStatus.LOG:
            case MessageStatus.INFO:
            case MessageStatus.DEBUG:
            case MessageStatus.ERROR:
                SentryHelper.captureMessage(message, level);
                break;
            default:
                console.warn(`Unhandled severity level: ${level}`);
        }
    }
}
