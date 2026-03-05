const fs = require('fs');
const https = require('https');
const { parse } = require('csv-parse/sync');

const KPI_ITEMS = ['問合件数', 'メインターゲット数', 'メインターゲット率', 'meta広告問合せ', 'SR商談件数', 'MEET商談件数', '商談設定率', '受注件数', '受注率', '平均限界粗利単価', '施工部残業時間', '営業部残業時間'];

function parseVal(value) {
  if (!value || value.trim() === '' || value === '#DIV/0!' || value === '#VALUE!') return null;
  const cleaned = value.replace(/%/g, '').replace(/,/g, '').trim();
  if (cleaned === '' || cleaned === '-') return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parsePercent(value) {
  const v = parseVal(value);
  return v !== null ? v / 100 : null;
}

const csvPath = 'G:/共有ドライブ/ryouchiku-workspace/group/board of directors/【共有用】2026度月次会議用管理会計  - 週次KPI（積極版）.csv';
const text = fs.readFileSync(csvPath, 'utf-8');
const records = parse(text, { columns: false, skip_empty_lines: false, bom: true });

const year = 2026;
let currentMonth = 0;
const monthData = {};

for (const record of records) {
  const col0 = record[0]?.trim() || '';
  const monthMatch = col0.match(/^(\d+)月$/);
  if (monthMatch) {
    currentMonth = parseInt(monthMatch[1]);
    monthData[currentMonth] = [];
    continue;
  }
  if (currentMonth === 0 || !col0 || !KPI_ITEMS.includes(col0)) continue;

  const isPercent = col0.includes('率');
  const p = isPercent ? parsePercent : parseVal;

  monthData[currentMonth].push({
    itemName: col0,
    weeks: {
      week1: { target: p(record[1]), actual: p(record[2]) },
      week2: { target: p(record[4]), actual: p(record[5]) },
      week3: { target: p(record[7]), actual: p(record[8]) },
      week4: { target: p(record[10]), actual: p(record[11]) },
      week5: { target: p(record[13]), actual: p(record[14]) },
    }
  });
}

function postData(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'ryouchiku-dashboard.vercel.app',
      path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      timeout: 30000
    };
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const months = Object.keys(monthData).map(Number).sort((a, b) => a - b);
  for (const month of months) {
    const items = monthData[month];
    const result = await postData('/api/admin/weekly-kpi', { year, month, items });
    console.log(`${month}月 (${items.length}件):`, result.status, result.body.message || result.body.error);
  }
  console.log('週次KPIインポート完了');
}

main().catch(console.error);
