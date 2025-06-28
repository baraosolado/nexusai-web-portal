import fs from "fs";
import path from "path";

function readProjectAsJSON(dir = ".", basePath = "") {
  const result = {};

  try {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      // Ignorar arquivos/pastas específicos
      const ignoredItems = [
        "node_modules",
        ".git",
        ".replit",
        "replit.nix",
        "package-lock.json",
        "export-to-json.js", // Ignorar o próprio script
        "project-export.json", // Ignorar exports anteriores
      ];

      if (ignoredItems.includes(file)) {
        return;
      }

      const filePath = path.join(dir, file);
      const relativePath = basePath ? `${basePath}/${file}` : file;

      try {
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          // Se for uma pasta, processar recursivamente
          const subResult = readProjectAsJSON(filePath, relativePath);
          if (Object.keys(subResult).length > 0) {
            result[relativePath] = {
              type: "directory",
              contents: subResult,
            };
          }
        } else {
          // Se for um arquivo, ler o conteúdo
          const content = fs.readFileSync(filePath, "utf8");
          result[relativePath] = {
            type: "file",
            content: content,
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
          };
        }
      } catch (err) {
        console.log(`Erro ao processar ${filePath}:`, err.message);
      }
    });
  } catch (err) {
    console.log(`Erro ao ler diretório ${dir}:`, err.message);
  }

  return result;
}

// Exportar o projeto
console.log("Iniciando exportação do projeto...");

const projectData = {
  metadata: {
    exportedAt: new Date().toISOString(),
    projectName: path.basename(process.cwd()),
    description: "Projeto exportado do Replit",
  },
  files: readProjectAsJSON(),
};

const jsonOutput = JSON.stringify(projectData, null, 2);

// Salvar o arquivo JSON
fs.writeFileSync("project-export.json", jsonOutput);

console.log("✅ Projeto exportado com sucesso para project-export.json");
console.log(
  `📊 Tamanho do arquivo: ${(jsonOutput.length / 1024).toFixed(2)} KB`,
);
console.log(
  `📁 Arquivos processados: ${Object.keys(projectData.files).length}`,
);
