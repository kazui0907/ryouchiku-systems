const fs = require('fs');
const {parse} = require('csv-parse/sync');
const csvPath = 'G:/共有ドライブ/ryouchiku-workspace/group/board of directors/【共有用】2026度月次会議用管理会計  - 週次現場KPI（積極版）.csv';
const text = fs.readFileSync(csvPath, 'utf-8');
const records = parse(text, { columns: false, skip_empty_lines: false, bom: true });

let inMonth1 = false;
for (const r of records) {
  const col0 = r[0]?.trim() || '';
  const col1 = (r[1] || '').replace(/^[\s\u3000]+/, '').trim();
  if (col0 === '1月') { inMonth1 = true; continue; }
  if (inMonth1 && col0.match(/^\d+月$/)) break;
  if (!inMonth1) continue;
  if (col0 || col1) console.log(JSON.stringify([col0, col1]));
}
