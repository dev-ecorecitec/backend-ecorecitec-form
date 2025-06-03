"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToExcel = saveToExcel;
const exceljs_1 = __importDefault(require("exceljs"));
const fs_1 = __importDefault(require("fs"));
async function saveToExcel(data) {
    const filePath = "pagamentos.xlsx";
    const workbook = new exceljs_1.default.Workbook();
    if (fs_1.default.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath);
    }
    else {
        workbook.addWorksheet("Pagamentos");
    }
    let sheet = workbook.getWorksheet("Pagamentos");
    if (!sheet) {
        sheet = workbook.addWorksheet("Pagamentos");
    }
    if (sheet.rowCount === 0) {
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
        ];
    }
    const existingData = new Set();
    if (sheet.rowCount > 1) {
        const rows = sheet.getRows(2, sheet.rowCount - 1);
        if (rows) {
            rows.forEach((row) => {
                if (row.values && Array.isArray(row.values)) {
                    const rowKey = row.values.slice(1).join("-");
                    existingData.add(rowKey);
                }
            });
        }
    }
    data.forEach((row) => {
        const rowKey = Object.values(row).join("-");
        if (!existingData.has(rowKey)) {
            sheet.addRow(row);
            existingData.add(rowKey);
        }
    });
    await workbook.xlsx.writeFile(filePath);
    console.log("Dados adicionados com sucesso!");
}
