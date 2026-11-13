// Reproduce the reference-data audit without modifying either source dataset.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'assets/time_and_scores.js'), 'utf8')
  + ';this.rows = time_and_scores;', context);
const rows = context.rows;
const csv = fs.readFileSync(path.join(root, 'iq_test_result.csv'), 'utf8').trim()
  .split(/\r?\n/).slice(1).map(line => line.split(';').map(Number));

function difference(left, right) {
  const counts = new Map();
  for (const row of right) {
    const key = JSON.stringify(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return left.filter(row => {
    const key = JSON.stringify(row);
    if (!counts.get(key)) return true;
    counts.set(key, counts.get(key) - 1);
    return false;
  });
}

const definitions = [
  ['all', () => true],
  ['at_most_60s', row => row[0] <= 60],
  ['61_to_2400s', row => row[0] > 60 && row[0] <= 2400],
  ['over_2400s', row => row[0] > 2400],
  ['2401_to_2460s', row => row[0] > 2400 && row[0] <= 2460],
  ['over_1h', row => row[0] > 3600]
];
const report = {
  source: 'assets/time_and_scores.js; iq_test_result.csv',
  recruitment: {
    method: 'Paid Facebook advertisements; participants chose to take the test.',
    evidence: 'Project owner Kent, conversation on 13 November 2026.',
    selectionBias: 'Direction and magnitude unknown; no numerical population adjustment applied.'
  },
  csvRows: csv.length,
  javaScriptRows: rows.length,
  csvMatchesJavaScript: JSON.stringify(csv) === JSON.stringify(rows),
  csvOnlyRows: difference(csv, rows),
  javaScriptOnlyRows: difference(rows, csv),
  groups: definitions.map(([label, filter]) => {
    const group = rows.filter(filter);
    const times = group.map(row => row[0]).sort((a, b) => a - b);
    return {
      label, count: group.length,
      meanScore: group.reduce((sum, row) => sum + row[1], 0) / group.length,
      minSeconds: times[0], medianSeconds: times[Math.floor(times.length / 2)], maxSeconds: times.at(-1)
    };
  }),
  limitations: [
    'No participant demographics, item-level responses or timestamps available.',
    'Recorded durations do not establish enforcement of a historical deadline.',
    'No historical collection or filtering pipeline is present in this repository.',
    'Differences between CSV and JavaScript cannot be explained from the available history.',
    'Excluding attempts above 2400 seconds changes the comparison population; no validated IQ conversion follows.'
  ]
};
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports/reference-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ csvRows: csv.length, javaScriptRows: rows.length,
  csvOnly: report.csvOnlyRows.length, javaScriptOnly: report.javaScriptOnlyRows.length,
  csvOnlyScores: [...new Set(report.csvOnlyRows.map(row => row[1]))] }, null, 2));
