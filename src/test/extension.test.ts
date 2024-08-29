import path from "path";
import * as fs from "fs";

fs.copyFile(path.join(__dirname, "../../package.json"), path.join(__dirname, "../package.json"), (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("package.json copied to out folder");
    }
});
