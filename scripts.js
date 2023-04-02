/**
 * Main purpose of this is
 * 1. to create new version of the applicaiton ✔️
 * 2. upload apk to google drive ✔️
 * 3. upload apk to firestore ❌
 * 4. pulish to store ❌
 * */

import fs from "fs";
import shell from "shelljs";
import { uploadFileToDrive } from "./GoogleDrive.js";

/**
 * store your google api keys in .env file and use them
 */
// import { config } from "dotenv";
// config();
// console.log(process.env.HELLO);

/**
 * use this if you needed to add KEY or something via cmd 🤔
 * ex : yarn update --KEY XXXXXXXXXXXXXX
 */
// import { Command } from "commander";
// const program = new Command();
// program
//   .option("-v", "app version")
//   .option("-c, --KEY <type>", "add the key", "XXXXXXXXXXXXXXX")
//   .parse();
// const options = program.opts();
// const version = options.v;
// const key = options.KEY;

let filePath = "build.gradle";

let versionCodeRegX = /(?<=versionCode\s)(\d+)/g;
let versionNameRegX = /(?<=versionName ")(\d+).(\d+)/g;

fs.readFile(filePath, "utf8", async (err, doc) => {
  if (err) {
    console.log(err);
  }

  let versionCode = doc.match(versionCodeRegX);
  let versionName = doc.match(versionNameRegX);

  let currentCode = Number.parseInt(versionCode[0]);

  let splitVersionName = versionName[0].split(".");

  let newVersionCode = currentCode + 1;
  let newVersionName = `${splitVersionName[0]}.${
    Number.parseInt(splitVersionName[1]) + 1
  }`;

  var res = await doc
    .replace(versionCodeRegX, newVersionCode)
    .replace(versionNameRegX, newVersionName);

  await updateDoc(res, newVersionCode, newVersionName);
});

async function updateDoc(content, newVersionCode, newVersionName) {
  await fs.writeFile("build.gradle", content, "utf8", (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("versionCode ", newVersionCode);
    console.log("versionName ", newVersionName);
    console.log("Updated !!");

    // run your command to create assemble build
    // shell.exec("cd android && ./gradlew clean assembleRelease");

    /**
     * better to run with bash or one support mv
     * to check this rename the file starting with v- or create a file called "release"
     * */
    let { stderr, stdout } = shell.exec(
      `mv release.apk v-${newVersionName}.apk`
    );
    if (!!stderr) {
      console.log(
        `If you are seeing error like "is not recognized as an internal or external command" use bash or related one`
      );
    }
    if (!!stdout) {
      console.log(stdout);
    }
  });

  let shareableLink = await uploadFileToDrive(`v-${newVersionName}`);
  console.log("Sharable Link :: ", shareableLink);
}
