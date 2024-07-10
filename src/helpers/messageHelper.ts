import { MessageStatus, Organization } from "../constants/index";

export default class StatusMessage {
    public static getStatusMessage(type: string, command: string): string {
        switch (type) {
            case MessageStatus.START:
                return `${Organization.name} - ${command} started.`;
            case MessageStatus.COMPLETE:
                return `${Organization.name} - ${command} completed.`;
            case MessageStatus.ERROR:
                return `${Organization.name} - ${command} encountered an error.`;
            case MessageStatus.FINISHED:
                return `${Organization.name} - ${command} finished.`;
            default:
                return `${Organization.name} - ${command} unknown status.`;
        }
    }
}
