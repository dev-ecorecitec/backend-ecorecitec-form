import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const KEYFILEPATH = path.join(process.cwd(), 'service-account.json');
const FOLDER_ID = '1jVLp66AL3_XyNaIn8Y5dbAzipkB3nLn_';

async function deleteExistingFiles(drive: any) {
  try {
    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents`,
      fields: 'files(id, name)',
    });

    const files = response.data.files;
    
    for (const file of files) {
      await drive.files.delete({
        fileId: file.id,
      });
      console.log(`Arquivo deletado: ${file.name}`);
    }
  } catch (error) {
    console.error('Erro ao deletar arquivos existentes:', error);
    throw error;
  }
}

export async function uploadToGoogleDrive(filePath: string, fileName: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });

    const drive = google.drive({ version: 'v3', auth });

    // Primeiro, deleta todos os arquivos existentes
    await deleteExistingFiles(drive);

    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID],
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
