import { join } from "path";
import { cwd } from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import fs, { createReadStream } from "fs";
import mime from "mime";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = join(cwd(), "token.json");
const CREDENTIALS_PATH = join(cwd(), "credentials.json");


async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

// let mim = fs.stat("./photo.jpg", (error, stats) => {
//   console.log(stats);
// });


// console.log(mime.getType("./photo.jpg"));

// return null;

// let fffff = createReadStream("./photo.jpg");
// console.log(fffff);


async function saveCredentials(client) {
  const content = fs.readFileSync(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  fs.writeFileSync(TOKEN_PATH, payload);
}


async function authorize() {
  let client = await loadSavedCredentialsIfExist();

  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

// async function listFiles(authClient) {
//   const drive = google.drive({ version: "v3", auth: authClient });
//   const res = await drive.files.list({
//     pageSize: 10,
//     fields: "nextPageToken, files(id, name)",
//   });
//   const files = res.data.files;
//   if (files.length === 0) {
//     console.log("No files found.");
//     return;
//   }

//   console.log("Files:");
//   files.map((file) => {
//     console.log(`${file.name} (${file.id})`);
//   });
// }

async function upload(authClient,fileName) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const requestBody = {
    name: fileName,
    fields: "id",
    // mimeType: "application/vnd.google-apps.unknown", // <- unknown type
    // mimeType: 'application/octet-stream', // <- unknown type
    role: 'reader',
    type: 'anyone',
  };
  const media = {
    resumable: true,
    mimeType: mime.getType(`./${fileName}.apk`), // use this otherwise drive will extract the file
    body: createReadStream(`./${fileName}.apk`),
  };

  try {
    const file = await drive.files.create({
      requestBody,
      media: media,
    });
    console.log("File Id:", file.data.id);
    // return file.data.id;

    const webViewLink = await drive.files.get({
      fileId:  file.data.id,
      fields: 'webViewLink'
    }).then(response => 
      response.data.webViewLink
    );

    return webViewLink;

  } catch (err) {
    console.error("TASK FAILED",err)
  }
}

export async function uploadFileToDrive(filename) {
  if (!!filename) {
    const auth = await authorize();
    return await upload(auth,filename);
  } else {
    return console.warn("TASK FAILED: filename is Empty");
  }
}


