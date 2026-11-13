const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function load(options = {}) {
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
  let now = options.now ?? 1000;
  const store = options.store ?? new Map();
  const windowEvents = {};
  const storage = {
    getItem(key) { if (options.failRead) throw new Error('Storage blocked'); return store.get(key) ?? null; },
    setItem(key, value) { if (options.failWrite) throw new Error('Quota exceeded'); store.set(key, value); },
    removeItem(key) { store.delete(key); }
  };
  const intervals = new Set();
  const context = vm.createContext({
    Date: { now: () => now }, Image: class {}, localStorage: storage,
    document: { getElementById: element, querySelector: element, createElement: makeElement, addEventListener() {} },
    window: { addEventListener(event, handler) { windowEvents[event] = handler; } },
    setInterval(callback) { intervals.add(callback); return callback; },
    clearInterval(id) { intervals.delete(id); }
  });
  for (const file of ['time_and_scores.js', 'md5.js', 'app.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets', file), 'utf8'), context);
  }
  return { run: code => vm.runInContext(code, context), element, intervals, store, windowEvents, advance: ms => { now += ms; } };
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

test('practice gives feedback without starting the timer or contributing answers', () => {
  const app = load();
  app.element('start-link').events.click();
  assert.equal(app.element('practice').hidden, false);
  assert.equal(app.intervals.size, 0);
  app.element('practice-circle').events.click();
  assert.match(app.element('practice-feedback').textContent, /Try again/);
  app.element('practice-square').events.click();
  assert.match(app.element('practice-feedback').textContent, /Correct!/);
  assert.equal(app.run('answers.length'), 0);
  assert.equal(app.store.size, 0);
  app.advance(15 * 60 * 1000);
  app.element('practice-start-link').events.click();
  assert.equal(app.element('time-left').textContent, '40:00');
  assert.equal(app.element('practice').hidden, true);
  assert.equal(app.run('answers.length'), 0);
});

test('reload restores answers, original start time and remaining deadline', () => {
  const first = load();
  first.run('start_test(); submit_answer(1, get_hash(1, 1, true)); submit_answer(2, get_hash(2, 2, true));');
  const reloaded = load({ store: first.store, now: 1000 + 7 * 60 * 1000 });
  assert.equal(reloaded.run('answers.length'), 2);
  assert.equal(reloaded.run('started_at'), 1000);
  assert.equal(reloaded.element('question-number').textContent, 'Question 3 / 36');
  assert.equal(reloaded.element('time-left').textContent, '33:00');
  assert.equal(reloaded.intervals.size, 1);
  reloaded.run('start_test()');
  assert.equal(reloaded.run('started_at'), 1000, 'a second start cannot reset a running timer');
  reloaded.advance(33 * 60 * 1000);
  reloaded.run('update_timer()');
  assert.equal(reloaded.element('score').textContent, '1 / 36 correct');
});

test('reopening after the deadline scores stored answers instead of resetting', () => {
  const first = load();
  first.run('start_test(); submit_answer(1, get_hash(1, 1, true));');
  const reloaded = load({ store: first.store, now: 1000 + 40 * 60 * 1000 });
  assert.equal(reloaded.element('result').hidden, false);
  assert.match(reloaded.element('result-reason').textContent, /Time is up/);
  assert.equal(reloaded.element('score').textContent, '1 / 36 correct');
  assert.equal(reloaded.element('answered-count').textContent, '1 answered; 35 unanswered.');
  assert.equal(reloaded.intervals.size, 0);
  assert.equal(reloaded.run('deadline'), 1000 + 40 * 60 * 1000);
});

test('a completed result survives reload and Try again waits in untimed practice', () => {
  const first = load();
  first.run('start_test(); for (let q = 1; q <= 36; q++) submit_answer(q, get_hash(q, 1, true));');
  const reloaded = load({ store: first.store, now: 1000 + 41 * 60 * 1000 });
  assert.equal(reloaded.element('score').textContent, '36 / 36 correct');
  assert.equal(reloaded.element('result-reason').textContent, 'Test completed.');
  reloaded.element('restart-link').events.click();
  assert.equal(reloaded.intervals.size, 0);
  assert.equal(reloaded.element('practice').hidden, false);
  reloaded.element('practice-start-link').events.click();
  assert.equal(reloaded.element('time-left').textContent, '40:00');
  assert.equal(reloaded.run('answers.length'), 0);
  assert.equal(reloaded.run('started_at'), 1000 + 41 * 60 * 1000);
});

test('corrupt, incompatible and invalid saved attempts are discarded without a crash', () => {
  const valid = { version: 1, startedAt: 1000, answers: [], completed: false, timedOut: false };
  for (const raw of ['{broken', 'null', JSON.stringify({ ...valid, version: 99 }),
    JSON.stringify({ ...valid, startedAt: 2000 }), JSON.stringify({ ...valid, answers: ['bad'] }),
    JSON.stringify({ ...valid, answers: Array(37).fill('bad') }), JSON.stringify({ ...valid, completed: true })]) {
    const app = load({ store: new Map([['iqchampion.attempt.v1', raw]]) });
    assert.equal(app.intervals.size, 0);
    assert.equal(app.run('finished'), true);
    assert.match(app.element('storage-notice').textContent, /could not be restored/);
    assert.equal(app.store.size, 0);
  }
});

test('unavailable storage and write failures do not interrupt the active test', () => {
  for (const options of [{ failRead: true, failWrite: true }, { failWrite: true }]) {
    const app = load(options);
    app.run('start_test(); submit_answer(1, get_hash(1, 1, true));');
    assert.equal(app.element('question-number').textContent, 'Question 2 / 36');
    assert.equal(app.element('storage-notice').hidden, false);
    assert.match(app.element('storage-notice').textContent, /could not save/);
    app.advance(40 * 60 * 1000);
    app.run('update_timer()');
    assert.equal(app.element('score').textContent, '1 / 36 correct');
  }
});

test('a second tab picks up stored progress before accepting a stale answer', () => {
  const first = load();
  first.run('start_test()');
  const second = load({ store: first.store });
  first.run('submit_answer(1, get_hash(1, 1, true))');
  second.run('submit_answer(1, get_hash(1, 2, true))');
  assert.equal(second.run('answers.length'), 1);
  assert.equal(second.run('answers[0] === get_hash(1, 1, true)'), true);
  first.run('submit_answer(2, get_hash(2, 1, true))');
  second.windowEvents.storage({ key: 'iqchampion.attempt.v1' });
  assert.equal(second.element('question-number').textContent, 'Question 3 / 36');
});

test('timeout in a suspended tab reconciles newer stored answers before scoring', () => {
  const first = load();
  first.run('start_test()');
  const second = load({ store: first.store });
  first.run('submit_answer(1, get_hash(1, 1, true))');
  second.advance(40 * 60 * 1000);
  second.run('update_timer()');
  assert.equal(second.element('score').textContent, '1 / 36 correct');
  assert.equal(second.element('answered-count').textContent, '1 answered; 35 unanswered.');
  assert.equal(second.intervals.size, 0);
});
