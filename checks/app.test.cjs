const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function load() {
  const elements = new Map();
  const makeElement = () => ({
    hidden: false, textContent: '', children: [], events: {},
    classList: { toggle() {} }, focus() {}, setAttribute() {},
    replaceChildren() { this.children = []; },
    append(child) { this.children.push(child); },
    addEventListener(event, handler) { this.events[event] = handler; }
  });
  const element = id => {
    if (!elements.has(id)) elements.set(id, makeElement());
    return elements.get(id);
  };
  let now = 1000;
  const intervals = new Set();
  const context = vm.createContext({
    Date: { now: () => now }, Image: class {},
    document: { getElementById: element, querySelector: element, createElement: makeElement, addEventListener() {} },
    window: { addEventListener() {} },
    setInterval(callback) { intervals.add(callback); return callback; },
    clearInterval(id) { intervals.delete(id); }
  });
  for (const file of ['time_and_scores.js', 'md5.js', 'app.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets', file), 'utf8'), context);
  }
  return { run: code => vm.runInContext(code, context), element, intervals, advance: ms => { now += ms; } };
}

test('historical reference excludes durations outside the stated range', () => {
  const app = load();
  assert.equal(app.run('reference_scores.length'), 10216);
  assert.equal(app.run('reference_scores.every(row => row[0] > 60 && row[0] <= 2400)'), true);
});

test('zero, partial and perfect scores; ties use the midpoint with no artificial floor', () => {
  const app = load();
  assert.equal(app.run('calculate_score([], reference_scores).correct'), 0);
  assert.equal(app.run('calculate_score([], reference_scores).percentile'), 0);
  const tied = app.run('calculate_score([get_hash(1, 1, true)], [[120, 0], [120, 1], [120, 1], [120, 2]])');
  assert.equal(tied.correct, 1);
  assert.equal(tied.below_percent, 25);
  assert.equal(tied.equal_percent, 50);
  assert.equal(tied.percentile, 50);
  assert.equal(app.run('calculate_score([], []).percentile'), null);
  assert.equal(app.run("format_percent(99.999)"), '>99.9');
  app.run('start_test(); for (let id = 1; id <= 36; id++) submit_answer(id, get_hash(id, 1, true));');
  assert.equal(app.element('score').textContent, '36 / 36 correct');
  assert.equal(app.element('test').hidden, true);
  assert.equal(app.intervals.size, 0);
  assert.equal(app.element('comparison').textContent.includes('100.0%'), false);
});

test('timer uses elapsed wall time and rejects an answer at the deadline', () => {
  const app = load();
  app.run('start_test(); submit_answer(1, get_hash(1, 1, true));');
  assert.equal(app.element('time-left').textContent, '40:00');
  app.advance(35 * 60 * 1000);
  app.run('update_timer()');
  assert.equal(app.element('time-left').textContent, '05:00');
  app.advance(5 * 60 * 1000);
  // No intervening interval callback: simulate a suspended/background tab.
  app.run('submit_answer(2, get_hash(2, 1, true))');
  assert.equal(app.element('time-left').textContent, '00:00');
  assert.equal(app.element('score').textContent, '1 / 36 correct');
  assert.equal(app.element('answered-count').textContent, '1 answered; 35 unanswered.');
  assert.match(app.element('result-reason').textContent, /Time is up/);
  assert.equal(app.intervals.size, 0);
  app.run('submit_answer(2, get_hash(2, 1, true))');
  assert.equal(app.run('answers.length'), 1);
});

test('automatic timeout scores zero answers and restarting resets the attempt', () => {
  const app = load();
  app.run('start_test()');
  app.advance(41 * 60 * 1000);
  app.run('update_timer()');
  assert.equal(app.element('score').textContent, '0 / 36 correct');
  app.run('start_test()');
  assert.equal(app.element('time-left').textContent, '40:00');
  assert.equal(app.element('result').hidden, true);
  assert.equal(app.run('answers.length'), 0);
  assert.equal(app.intervals.size, 1);
});

test('stale and invalid answers do not advance the question', () => {
  const app = load();
  app.run("start_test(); submit_answer(1, 'invalid'); submit_answer(2, get_hash(2, 1, true));");
  assert.equal(app.run('answers.length'), 0);
  app.run('submit_answer(1, get_hash(1, 1, true)); submit_answer(1, get_hash(1, 1, true));');
  assert.equal(app.run('answers.length'), 1);
  assert.equal(app.element('test-right').children.length, 9);
});
