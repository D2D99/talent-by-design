import { ESLint } from "eslint";

async function runLint() {
  console.log("Scanning source files...");
  
  // Instantiate ESLint with flat config support
  const eslint = new ESLint();

  // Lint files inside src directory
  const results = await eslint.lintFiles(["src/**/*.{ts,tsx}"]);

  let totalErrors = 0;
  let totalWarnings = 0;
  const filesChecked = results.length;

  results.forEach((result) => {
    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;
  });

  // Load and apply the stylish formatter
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // If there are issues, print them
  if (resultText.trim()) {
    console.log(resultText);
  }

  // Print a dynamic summary report
  console.log("-----------------------------------------");
  console.log(`Scan Complete: Checked ${filesChecked} files.`);
  console.log(`Linter Summary: ${totalErrors} errors, ${totalWarnings} warnings.`);
  console.log("-----------------------------------------");

  // Exit code based on error count
  if (totalErrors > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runLint().catch((error) => {
  console.error("Linter execution failed:", error);
  process.exit(1);
});
