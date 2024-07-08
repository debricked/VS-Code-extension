import { DebrickedSubCommandNode, Flag } from "@types";

export interface DebrickedCommandNode {
    label: string;
    cli_command: string;
    command: string;
    description: string;
    sub_commands?: DebrickedSubCommandNode[];
    flags?: Flag[];
    global_flags?: Flag[];
    report?: string;
}
