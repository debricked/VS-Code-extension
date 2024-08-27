export enum PolicyRules {
    warnPipeline = "Pipeline warning",
    failPipeline = "Pipeline failing",
    markUnaffected = "Mark vulnerability as unaffected",
    markVulnerable = "Flag vulnerability as vulnerable",
    sendEmail = "Notified email",
    triggerWebhook = "Triggered webhook",
}

export enum PolicyTriggerEvents {
    WARN_PIPELINE = "warnPipeline",
    FAIL_PIPELINE = "failPipeline",
}
