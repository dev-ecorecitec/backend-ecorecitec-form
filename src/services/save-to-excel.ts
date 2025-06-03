import ExcelJS from "exceljs";
import fs from "fs";
import { uploadToGoogleDrive } from "./google-drive";

export async function saveToExcel(data: any[]) {
  const filePath = "pagamentos.xlsx";
  const workbook = new ExcelJS.Workbook();

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  } else {
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
      { header: "Teste gratuito do método de mindset", key: "Teste gratuito do método de mindset", width: 30 },
      { header: "Disponibilidade de horário para o teste", key: "Disponibilidade de horário para o teste", width: 30 },
      { header: "Indicação", key: "Indicação", width: 20 },
      { header: "Expectativas", key: "Expectativas", width: 30 },
    ];
  }

  const existingData = new Set<string>();

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

  // Upload para o Google Drive
  try {
    const fileName = `pagamentos_${new Date().toISOString().split('T')[0]}.xlsx`;
    await uploadToGoogleDrive(filePath, fileName);
    console.log("Arquivo enviado para o Google Drive com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar para o Google Drive:", error);
  }
}
