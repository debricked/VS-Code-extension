import { MessageStatus, Organization } from "../constants/index";

export class StatusMessage {
    public static getStatusMessage(type: string, command: string): string {
        switch (type) {
            case MessageStatus.START:
                return `${Organization.nameCaps} - ${command} started.`;
            case MessageStatus.COMPLETE:
                return `${Organization.nameCaps} - ${command} completed.`;
            case MessageStatus.ERROR:
                return `${Organization.nameCaps} - ${command} encountered an error.`;
            case MessageStatus.FINISHED:
                return `${Organization.nameCaps} - ${command} finished.`;
            default:
                return `${Organization.nameCaps} - ${command} unknown status.`;
        }
    }
}
