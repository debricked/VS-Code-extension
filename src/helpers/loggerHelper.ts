import * as fs from 'fs';
import * as path from 'path';
import { ORGANIZATION } from '../constants';
import { getFromDebrickedData } from './commonHelper';

const logDirPath = path.join(ORGANIZATION.workspace, ORGANIZATION.report);
const logFilePath = path.join(logDirPath, ORGANIZATION.log_file);

export async function logMessage(message: string, seqToken?: string) {
    if (!fs.existsSync(logDirPath)) {
        fs.mkdirSync(logDirPath, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const userId = await getFromDebrickedData('user_id');
    const sequenceId = seqToken ? `[seq_id:${seqToken}]` : '';

    const logEntry = `[${timestamp}] [user_id:${userId}] ${sequenceId} ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf-8');
}

export function logMessageByStatus(status: string, message: string, seqToken?: string) {
    logMessage(`[${status}] ${message}`, seqToken);
}
