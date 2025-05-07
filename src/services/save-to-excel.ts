import ExcelJS from "exceljs";

export async function saveToExcel(data: any[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pagamentos");

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

  data.forEach((row) => sheet.addRow(row));

  await workbook.xlsx.writeFile("pagamentos.xlsx");
  console.log("Planilha salva com sucesso!");
}