const fs = require('fs');
const { parse } = require('csv-parse/sync');

const csvPath = 'G:/共有ドライブ/ryouchiku-workspace/group/board of directors/【共有用】2026度月次会議用管理会計  - 月次予測.csv';
const text = fs.readFileSync(csvPath, 'utf-8');
const records = parse(text, { columns: false, skip_empty_lines: true, bom: true });

console.log('=== 期首・期末を含む全行 ===');
records.forEach((row, idx) => {
  const col0 = row[0]?.trim() || '';
  const col1 = row[1]?.trim() || '';
  const col2 = row[2]?.trim() || '';
  const label = col0 || col1 || col2;
  if (label.includes('期首') || label.includes('期末')) {
    console.log(`行${idx}: col0=[${col0}] col1=[${col1}] col2=[${col2}]`);
    console.log(`  1月 actual=${row[5]}  2月 actual=${row[10]}`);
  }
});
