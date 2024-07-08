import { Flag } from "@types";

export interface DebrickedSubCommandNode {
    label: string;
    command?: string;
    description?: string;
    flags?: Flag[];
}
