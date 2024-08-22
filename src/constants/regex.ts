export class Regex {
    static readonly repoId = /\/repository\/(\d+)\//;
    static readonly commitId = /\/commit\/(\d+)/;
    static readonly packageJson = /"([^"]+)":\s*"([^"]+)"/;
    static readonly goMod =
        /^(?:require\s+)?(\S+)\s+(v?\d+(?:\.\d+)*(?:-[\w\.-]+)?(?:\+[\w\.-]+)?)(?:\s+\/\/\s+indirect)?/;
}
