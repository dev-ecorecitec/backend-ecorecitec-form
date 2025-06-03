import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const KEYFILEPATH = path.join(process.cwd(), 'service-account.json');

export async function uploadToGoogleDrive(filePath: string, fileName: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });

    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ''],
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });

    console.log('Arquivo enviado com sucesso. ID:', response.data.id);
    return response.data.id;
  } catch (error) {
    console.error('Erro ao enviar para o Google Drive:', error);
    throw error;
  }
}
