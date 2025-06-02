import ExcelJS from "exceljs";
import fs from "fs";

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
}
