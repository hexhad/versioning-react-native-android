import fs from "fs";
import shell from "shelljs";

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

  var res = await doc
    .replace(versionCodeRegX, currentCode + 1)
    .replace(
      versionNameRegX,
      `${splitVersionName[0]}.${Number.parseInt(splitVersionName[1]) + 1}`
    );

  await updateDoc(res);
});

async function updateDoc(content) {
  await fs.writeFile("build.gradle", content, "utf8", (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Updated !!");

    // run your command to create assemble build
    // shell.exec("cd android && ./gradlew clean assembleRelease");
    shell.exec("echo hello");
  });
}
