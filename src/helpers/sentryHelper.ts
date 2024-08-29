import * as Sentry from "@sentry/node";
import { Environment, MessageStatus, Organization } from "../constants";
import * as vscode from "vscode";
import { GlobalStore } from "./globalStore";

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
        environment: Environment,
        tracesSampleRate: number = 1.0,
    ): void {
        if (!SentryHelper.instance) {
            Sentry.init({
                dsn,
                release,
                environment,
                tracesSampleRate,
                tracesSampler: (samplingContext) => {
                    if (samplingContext.op === "http") {
                        return 0.2;
                    }
                    return 1;
                },
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
        Sentry.captureException(error.message);
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
    public static setTag(key: string, value: string = ""): void {
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

    public static async configureSentry(): Promise<void> {
        const isSentryEnabled = await SentryHelper.getSentryEnabledState();

        if (isSentryEnabled === "Yes") {
            SentryHelper.initialize(
                Organization.sentry_dns,
                `${Organization.packageJson.name}@${Organization.packageJson.version}`,
                Organization.environment,
            );
            vscode.window.showWarningMessage("Logs are being sent to Sentry");
        } else {
            SentryHelper.close();
            vscode.window.showInformationMessage("Sentry Logs are disabled");
        }
    }

    public static async reConfigureSentry(): Promise<void> {
        const response = await vscode.window.showInformationMessage("Do you want to enable Sentry?", "Yes", "No");

        GlobalStore.getInstance().getGlobalStateInstance()?.setGlobalData("sentry_enabled", response);

        SentryHelper.configureSentry();
    }

    private static async getSentryEnabledState(): Promise<string | undefined> {
        let storedState = GlobalStore.getInstance().getGlobalStateInstance()?.getGlobalData("sentry_enabled");

        if (storedState === undefined) {
            storedState = await vscode.window.showInformationMessage("Do you want to enable Sentry?", "Yes", "No");
            GlobalStore.getInstance().getGlobalStateInstance()?.setGlobalData("sentry_enabled", storedState);
        }

        return storedState;
    }
}
