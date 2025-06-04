import ExcelJS from "exceljs";
import fs from "fs";
import { uploadToGoogleDrive } from "./google-drive";
import path from "path";

export async function saveToExcel(data: any[]) {
  console.log("Iniciando processo de salvamento no Excel");
  const filePath = path.join(process.cwd(), "pagamentos.xlsx");
  console.log("Caminho do arquivo:", filePath);
  
  try {
    // Verifica se o diretório tem permissões de escrita
    const dirPath = path.dirname(filePath);
    try {
      await fs.promises.access(dirPath, fs.constants.W_OK);
      console.log("Diretório tem permissões de escrita");
    } catch (error) {
      console.error("Erro: Diretório não tem permissões de escrita:", error);
      throw new Error("Sem permissão para escrever no diretório");
    }

    const workbook = new ExcelJS.Workbook();

    // Tenta ler o arquivo existente
    try {
      if (fs.existsSync(filePath)) {
        console.log("Arquivo Excel existente encontrado, lendo...");
        await workbook.xlsx.readFile(filePath);
        console.log("Arquivo Excel lido com sucesso");
      } else {
        console.log("Arquivo Excel não encontrado, criando novo...");
      }
    } catch (error) {
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
    const existingData = new Map<string, any>();

    if (sheet.rowCount > 1) {
      console.log("Verificando dados existentes na planilha");
      const rows = sheet.getRows(2, sheet.rowCount - 1);

      if (rows) {
        rows.forEach((row) => {
          if (row.values && Array.isArray(row.values)) {
            const cpf = row.getCell("CPF").value?.toString() || "";
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
      const cpf = row.CPF?.toString() || "";
      if (cpf && !existingData.has(cpf)) {
        sheet.addRow(row);
        existingData.set(cpf, Object.values(row));
        newRowsAdded++;
        console.log("Nova linha adicionada:", row);
      } else {
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
        await uploadToGoogleDrive(filePath, fileName);
        console.log("Arquivo enviado para o Google Drive com sucesso!");
      } catch (error) {
        console.error("Erro ao enviar para o Google Drive:", error);
        // Não lança o erro para não interromper o processo
      }
    } catch (error) {
      console.error("Erro ao salvar o arquivo Excel:", error);
      throw new Error("Não foi possível salvar o arquivo Excel");
    }
  } catch (error) {
    console.error("Erro no processo de salvamento:", error);
    throw error;
  }
}
