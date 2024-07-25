import { Flag } from "../types";

export interface DebrickedCommandNode {
    label: string;
    cli_command: string;
    command: string;
    description: string;
    sub_commands?: DebrickedCommandNode[];
    flags?: Flag[];
    global_flags?: Flag[];
    report?: string;
    isVisibleInTree?: boolean;
}
