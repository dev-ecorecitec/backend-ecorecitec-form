"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToGoogleDrive = uploadToGoogleDrive;
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const KEYFILEPATH = path_1.default.join(process.cwd(), 'service-account.json');
const FOLDER_ID = '1jVLp66AL3_XyNaIn8Y5dbAzipkB3nLn_';
async function deleteExistingFiles(drive) {
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
    }
    catch (error) {
        console.error('Erro ao deletar arquivos existentes:', error);
        throw error;
    }
}
async function uploadToGoogleDrive(filePath, fileName) {
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: SCOPES,
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        // Primeiro, deleta todos os arquivos existentes
        await deleteExistingFiles(drive);
        const fileMetadata = {
            name: fileName,
            parents: [FOLDER_ID],
        };
        const media = {
            mimeType: 'application/octet-stream',
            body: fs_1.default.createReadStream(filePath),
        };
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id',
        });
        console.log('Arquivo enviado com sucesso. ID:', response.data.id);
        return response.data.id;
    }
    catch (error) {
        console.error('Erro ao enviar para o Google Drive:', error);
        throw error;
    }
}
