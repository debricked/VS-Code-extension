export enum MessageStatus {
    START = "start",
    COMPLETE = "complete",
    ERROR = "error",
    FINISHED = "finished",
    INFO = "info",
    WARN = "warning",
    DEBUG = "debug",
    PENDING = "pending",
    SUCCESS = "success",
    UNKNOWN = "unknown",
    FATAL = "fatal",
    LOG = "log",
    EXCEPTION = "exception",
}

export enum Environment {
    DEV = "development",
    STAGING = "staging",
    PROD = "production",
    TEST = "test",
}

export enum Secrets {
    ACCESS = "access",
    BEARER = "bearer",
}

export enum SupportedFilesToScan {
    PACKAGE_JSON = "package.json",
}

export enum GlobalData {
    SENTRY_ENABLED = "sentry_enabled",
    AUTHORIZE_LOGIN = "authorize_login",
}

export enum UserResponse {
    YES = "Yes",
    NO = "No",
}
