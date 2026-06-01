/**
 * Extracts master template questions from seedQuestion.js and exports to Excel
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

// Read the seedQuestion.js file content
const seedFilePath = path.resolve(
  __dirname,
  "../new-tbd-backend/src/scripts/seedQuestion.js",
);

const raw = fs.readFileSync(seedFilePath, "utf-8");

// Extract the questions array from the file using regex
const match = raw.match(/const questions\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find questions array in file");
  process.exit(1);
}

// Evaluate safely using Function
let questions;
try {
  questions = new Function(`return ${match[1]}`)();
} catch (e) {
  console.error("Failed to parse questions:", e.message);
  process.exit(1);
}

console.log(`Found ${questions.length} questions`);

// Build rows for Excel
const rows = questions.map((q, i) => {
  const row = {
    "#": i + 1,
    stakeholder: q.stakeholder || "",
    domain: q.domain || "",
    subdomain: q.subdomain || "",
    questionCode: q.questionCode || "",
    questionType: q.questionType || "",
    scale: q.scale || "",
    questionStem: q.questionStem || "",
    insightPrompt: q.insightPrompt || "",
    subdomainWeight: q.subdomainWeight ?? "",
    order: q.order ?? "",
  };

  // Forced choice fields
  if (q.forcedChoice) {
    row["fc_optionA_label"] = q.forcedChoice.optionA?.label || "";
    row["fc_optionA_insightPrompt"] =
      q.forcedChoice.optionA?.insightPrompt || "";
    row["fc_optionB_label"] = q.forcedChoice.optionB?.label || "";
    row["fc_optionB_insightPrompt"] =
      q.forcedChoice.optionB?.insightPrompt || "";
    row["fc_higherValueOption"] = q.forcedChoice.higherValueOption || "";
  } else {
    row["fc_optionA_label"] = "";
    row["fc_optionA_insightPrompt"] = "";
    row["fc_optionB_label"] = "";
    row["fc_optionB_insightPrompt"] = "";
    row["fc_higherValueOption"] = "";
  }

  return row;
});

// Group by stakeholder for separate sheets
const byStakeholder = {};
rows.forEach((row) => {
  const key = row.stakeholder || "unknown";
  if (!byStakeholder[key]) byStakeholder[key] = [];
  byStakeholder[key].push(row);
});

// Create workbook
const wb = XLSX.utils.book_new();

// All questions sheet
const wsAll = XLSX.utils.json_to_sheet(rows);
styleSheet(wsAll, rows.length);
XLSX.utils.book_append_sheet(wb, wsAll, "All Questions");

// Per-stakeholder sheets
["employee", "manager", "leader"].forEach((role) => {
  if (byStakeholder[role]) {
    const ws = XLSX.utils.json_to_sheet(byStakeholder[role]);
    styleSheet(ws, byStakeholder[role].length);
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      role.charAt(0).toUpperCase() + role.slice(1),
    );
  }
});

function styleSheet(ws, rowCount) {
  // Set column widths
  ws["!cols"] = [
    { wch: 4 }, // #
    { wch: 11 }, // stakeholder
    { wch: 22 }, // domain
    { wch: 35 }, // subdomain
    { wch: 16 }, // questionCode
    { wch: 14 }, // questionType
    { wch: 14 }, // scale
    { wch: 80 }, // questionStem
    { wch: 80 }, // insightPrompt
    { wch: 16 }, // subdomainWeight
    { wch: 6 }, // order
    { wch: 50 }, // fc_optionA_label
    { wch: 60 }, // fc_optionA_insightPrompt
    { wch: 50 }, // fc_optionB_label
    { wch: 60 }, // fc_optionB_insightPrompt
    { wch: 20 }, // fc_higherValueOption
  ];
}

// Write file
const outPath = path.resolve(__dirname, "Master_Template_Questions.xlsx");
XLSX.writeFile(wb, outPath);

console.log(`\n✅ Excel file created: ${outPath}`);
console.log(`   Total questions: ${rows.length}`);
Object.entries(byStakeholder).forEach(([role, arr]) => {
  console.log(`   ${role}: ${arr.length} questions`);
});
