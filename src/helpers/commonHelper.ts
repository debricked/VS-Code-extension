import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ORGANIZATION } from '../constants';
import * as crypto from 'crypto';

const debrickedDataPath = path.join(ORGANIZATION.workspace, ORGANIZATION.name, ORGANIZATION.debricked_data_file);

function ensureDirectoryExists(filePath: string) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export async function getInput(prompt: string): Promise<string | undefined> {
    return await vscode.window.showInputBox({ prompt });
}

export async function saveToDebrickedData(key: string, value: string) {
    ensureDirectoryExists(debrickedDataPath);
    let data: any = {};
    if (fs.existsSync(debrickedDataPath)) {
        data = JSON.parse(fs.readFileSync(debrickedDataPath, 'utf-8'));
    }
    data[key] = value;
    fs.writeFileSync(debrickedDataPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getFromDebrickedData(key: string): Promise<string | undefined> {
    if (fs.existsSync(debrickedDataPath)) {
        const data = JSON.parse(fs.readFileSync(debrickedDataPath, 'utf-8'));
        return data[key];
    }
    return 'unknown-user';
}

// Function to generate a hash code identifier
export function generateHashCode(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
}

export async function checkUserId() {
    const user_id = await getFromDebrickedData('user_id');
    if (!user_id) {
        const userHashCode = generateHashCode(new Date().toDateString());
        saveToDebrickedData('user_id', userHashCode);
    }
}

