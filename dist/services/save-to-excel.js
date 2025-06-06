"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToExcel = saveToExcel;
const exceljs_1 = __importDefault(require("exceljs"));
const fs_1 = __importDefault(require("fs"));
const google_drive_1 = require("./google-drive");
const path_1 = __importDefault(require("path"));
async function saveToExcel(data) {
    console.log("Iniciando processo de salvamento no Excel");
    const filePath = path_1.default.join(process.cwd(), "pagamentos.xlsx");
    console.log("Caminho do arquivo:", filePath);
    try {
        // Verifica se o diretório tem permissões de escrita
        const dirPath = path_1.default.dirname(filePath);
        try {
            await fs_1.default.promises.access(dirPath, fs_1.default.constants.W_OK);
            console.log("Diretório tem permissões de escrita");
        }
        catch (error) {
            console.error("Erro: Diretório não tem permissões de escrita:", error);
            throw new Error("Sem permissão para escrever no diretório");
        }
        const workbook = new exceljs_1.default.Workbook();
        // Tenta ler o arquivo existente
        try {
            if (fs_1.default.existsSync(filePath)) {
                console.log("Arquivo Excel existente encontrado, lendo...");
                await workbook.xlsx.readFile(filePath);
                console.log("Arquivo Excel lido com sucesso");
            }
            else {
                console.log("Arquivo Excel não encontrado, criando novo...");
            }
        }
        catch (error) {
            console.error("Erro ao ler arquivo existente:", error);
            throw new Error("Não foi possível ler o arquivo Excel existente");
        }
        let sheet = workbook.getWorksheet("Pagamentos");
        if (!sheet) {
            console.log("Criando nova planilha 'Pagamentos'");
            sheet = workbook.addWorksheet("Pagamentos");
        }
        if (sheet.rowCount === 0) {
            console.log("Configurando colunas da planilha");
            sheet.columns = [
                { header: "Nome", key: "Nome", width: 20 },
                { header: "Telefone", key: "Telefone", width: 15 },
                { header: "Email", key: "Email", width: 25 },
                { header: "CPF", key: "CPF", width: 14 },
                { header: "País", key: "País", width: 15 },
                { header: "Cidade", key: "Cidade", width: 15 },
                { header: "LinkedIn", key: "LinkedIn", width: 30 },
                { header: "Empresa", key: "Empresa", width: 20 },
                { header: "Cargo", key: "Cargo", width: 20 },
                { header: "Teste gratuito do método de mindset", key: "Teste gratuito do método de mindset", width: 30 },
                { header: "Disponibilidade de horário para o teste", key: "Disponibilidade de horário para o teste", width: 30 },
                { header: "Indicação", key: "Indicação", width: 20 },
                { header: "Expectativas", key: "Expectativas", width: 30 },
            ];
        }
        // Cria um Map para armazenar dados existentes usando CPF como chave
        const existingData = new Map();
        if (sheet.rowCount > 1) {
            console.log("Verificando dados existentes na planilha");
            const rows = sheet.getRows(2, sheet.rowCount - 1);
            if (rows) {
                rows.forEach((row) => {
                    var _a;
                    if (row.values && Array.isArray(row.values)) {
                        const cpf = ((_a = row.getCell("CPF").value) === null || _a === void 0 ? void 0 : _a.toString()) || "";
                        if (cpf) {
                            existingData.set(cpf, row.values);
                        }
                    }
                });
            }
        }
        console.log("Adicionando novos dados à planilha");
        let newRowsAdded = 0;
        data.forEach((row) => {
            var _a;
            const cpf = ((_a = row.CPF) === null || _a === void 0 ? void 0 : _a.toString()) || "";
            if (cpf && !existingData.has(cpf)) {
                sheet.addRow(row);
                existingData.set(cpf, Object.values(row));
                newRowsAdded++;
                console.log("Nova linha adicionada:", row);
            }
            else {
                console.log("Linha duplicada ignorada (CPF já existe):", row);
            }
        });
        console.log(`Total de novas linhas adicionadas: ${newRowsAdded}`);
        try {
            console.log("Salvando arquivo Excel...");
            await workbook.xlsx.writeFile(filePath, {
                useStyles: true,
                useSharedStrings: true
            });
            console.log("Arquivo Excel salvo com sucesso!");
            // Upload para o Google Drive
            try {
                const fileName = `pagamentos_${new Date().toISOString().split('T')[0]}.xlsx`;
                console.log("Iniciando upload para o Google Drive:", fileName);
                await (0, google_drive_1.uploadToGoogleDrive)(filePath, fileName);
                console.log("Arquivo enviado para o Google Drive com sucesso!");
            }
            catch (error) {
                console.error("Erro ao enviar para o Google Drive:", error);
                // Não lança o erro para não interromper o processo
            }
        }
        catch (error) {
            console.error("Erro ao salvar o arquivo Excel:", error);
            throw new Error("Não foi possível salvar o arquivo Excel");
        }
    }
    catch (error) {
        console.error("Erro no processo de salvamento:", error);
        throw error;
    }
}
