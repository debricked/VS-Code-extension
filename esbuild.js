const esbuild = require("esbuild");
const { sentryEsbuildPlugin } = require("@sentry/esbuild-plugin");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
    name: "esbuild-problem-matcher",

    setup(build) {
        build.onStart(() => {
            console.log("[watch] build started");
        });
        build.onEnd((result) => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                console.error(`    ${location.file}:${location.line}:${location.column}:`);
            });
            console.log("[watch] build finished");
        });
    },
};

async function main() {
    const ctx = await esbuild.context({
        entryPoints: ["src/extension.ts"],
        bundle: true,
        format: "cjs",
        minify: production,
        sourcemap: true,
        sourcesContent: false,
        platform: "node",
        outfile: "dist/extension.js",
        external: ["vscode"],
        logLevel: "silent",
        plugins: [
            /* add to the end of plugins array */
            esbuildProblemMatcherPlugin,
            sentryEsbuildPlugin({
                authToken: process.env.SENTRY_AUTH_TOKEN,
                org: "debricked",
                project: "visual-studio-code-extensions",
                url: "https://sentry.debricked.com/",
                release: {
                    name: `vs-code-extension@${process.env.LATEST_TAG || "0.0.0-dev"}${process.env.LAT_COMMIT ? `+${process.env.LAT_COMMIT}-review` : ""}`,
                    dist: `${process.env.LATEST_TAG || "0.0.0-dev"}${process.env.LAT_COMMIT ? `+${process.env.LAT_COMMIT}-review` : ""}`,
                    cleanArtifacts: true,
                },
            }),
        ],
    });
    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
