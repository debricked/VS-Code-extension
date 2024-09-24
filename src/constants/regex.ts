export class Regex {
    static readonly repoId = /\/repository\/(\d+)\//;
    static readonly commitId = /\/commit\/(\d+)/;
    static readonly packageJson = /"([^"]+)":\s*"([^"]+)"/;
}
