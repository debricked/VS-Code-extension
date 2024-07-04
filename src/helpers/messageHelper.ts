import { ORGANIZATION } from '../constants';
import { MESSAGE_STATUS } from '../constants/messages';

export function getStatusMessage(type: string, command: string): string {
    switch (type) {
        case MESSAGE_STATUS.START:
            return `${ORGANIZATION.name} - ${command} started.`;
        case MESSAGE_STATUS.COMPLETE:
            return `${ORGANIZATION.name} - ${command} completed.`;
        case MESSAGE_STATUS.ERROR:
            return `${ORGANIZATION.name} - ${command} encountered an error.`;
        case MESSAGE_STATUS.FINISHED:
            return `${ORGANIZATION.name} - ${command} finished.`;
        default:
            return `${ORGANIZATION.name} - ${command} unknown status.`;
    }
}