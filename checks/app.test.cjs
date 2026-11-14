const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function load(options = {}) {
  const elements = new Map();
  const makeElement = () => ({
    hidden: false, textContent: '', children: [], events: {},
    attributes: {}, classList: { toggle() {} }, focus() {},
    setAttribute(name, value) { this.attributes[name] = value; },
    replaceChildren() { this.children = []; this.textContent = ''; this.innerHTML = ''; },
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
    window: { MuntheSystems: options.tracker, addEventListener(event, handler) { windowEvents[event] = handler; } },
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
  app.run('start_test(); for (let id = 1; id <= 36; id++) submit_answer(id, get_hash(id, 1, true)); request_finish(); finish_test();');
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
  assert.equal(app.run('answered_count()'), 1);
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
  assert.equal(app.run('answered_count()'), 0);
  assert.equal(app.intervals.size, 1);
});

test('stale and invalid answers do not advance the question', () => {
  const app = load();
  app.run("start_test(); submit_answer(1, 'invalid'); submit_answer(2, get_hash(2, 1, true));");
  assert.equal(app.run('answered_count()'), 0);
  app.run('submit_answer(1, get_hash(1, 1, true)); submit_answer(1, get_hash(1, 1, true));');
  assert.equal(app.run('answered_count()'), 1);
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
  assert.equal(app.run('answered_count()'), 0);
  assert.equal(app.store.size, 0);
  app.advance(15 * 60 * 1000);
  app.element('practice-start-link').events.click();
  assert.equal(app.element('time-left').textContent, '40:00');
  assert.equal(app.element('practice').hidden, true);
  assert.equal(app.run('answered_count()'), 0);
});

test('reload restores answers, original start time and remaining deadline', () => {
  const first = load();
  first.run('start_test(); submit_answer(1, get_hash(1, 1, true)); submit_answer(2, get_hash(2, 2, true));');
  const reloaded = load({ store: first.store, now: 1000 + 7 * 60 * 1000 });
  assert.equal(reloaded.run('answered_count()'), 2);
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
  first.run('start_test(); for (let q = 1; q <= 36; q++) submit_answer(q, get_hash(q, 1, true)); request_finish(); finish_test();');
  const reloaded = load({ store: first.store, now: 1000 + 41 * 60 * 1000 });
  assert.equal(reloaded.element('score').textContent, '36 / 36 correct');
  assert.equal(reloaded.element('result-reason').textContent, 'Test completed.');
  reloaded.element('restart-link').events.click();
  assert.equal(reloaded.intervals.size, 0);
  assert.equal(reloaded.element('practice').hidden, false);
  reloaded.element('practice-start-link').events.click();
  assert.equal(reloaded.element('time-left').textContent, '40:00');
  assert.equal(reloaded.run('answered_count()'), 0);
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
  assert.equal(second.run('answered_count()'), 1);
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

test('skipping preserves question positions and returning can replace an answer', () => {
  const app = load();
  app.run('start_test()');
  app.element('skip-link').events.click();
  assert.equal(app.element('question-number').textContent, 'Question 2 / 36');
  assert.equal(app.run('answers[0]'), null);
  app.run('submit_answer(2, get_hash(2, 1, true)); go_to_question(1); submit_answer(1, get_hash(1, 2, true));');
  assert.equal(app.run('answered_count()'), 2);
  assert.equal(app.run('calculate_score(answers, reference_scores).correct'), 1);
  app.run('go_to_question(1)');
  assert.equal(app.element('test-right').children.filter(button => button.attributes['aria-pressed'] === 'true').length, 1);
  app.run('submit_answer(1, get_hash(1, 1, true))');
  assert.equal(app.run('answered_count()'), 2);
  assert.equal(app.run('calculate_score(answers, reference_scores).correct'), 2);
  assert.equal(app.element('question-number').textContent, 'Question 3 / 36');
});

test('overview distinguishes answered, unanswered and current questions', () => {
  const app = load();
  app.run('start_test(); go_to_question(36); submit_answer(36, get_hash(36, 1, true));');
  const buttons = app.element('question-overview').children;
  assert.equal(buttons.length, 36);
  assert.equal(buttons[0].attributes['aria-label'], 'Question 1, unanswered');
  assert.equal(buttons[35].attributes['aria-label'], 'Question 36, answered');
  assert.equal(buttons[0].attributes['aria-current'], 'step');
  assert.equal(app.element('progress-summary').textContent, '1 answered; 35 unanswered.');
  buttons[35].events.click();
  assert.equal(app.element('question-number').textContent, 'Question 36 / 36');
  app.element('skip-link').events.click();
  assert.equal(app.element('question-number').textContent, 'Question 1 / 36');
  assert.equal(app.element('previous-link').disabled, true);
});

test('navigation and sparse answers survive reload with the original deadline', () => {
  const first = load();
  first.run('start_test(); go_to_question(12); submit_answer(12, get_hash(12, 1, true)); go_to_question(7)');
  const reloaded = load({ store: first.store, now: 1000 + 10 * 60 * 1000 });
  assert.equal(reloaded.element('question-number').textContent, 'Question 7 / 36');
  assert.equal(reloaded.element('time-left').textContent, '30:00');
  assert.equal(reloaded.run('answers[0]'), null);
  assert.equal(reloaded.run('answers[11] === get_hash(12, 1, true)'), true);
  assert.equal(reloaded.run('calculate_score(answers, reference_scores).correct'), 1);
});

test('all answered still allows review and changes before explicit finish', () => {
  const app = load();
  app.run('start_test(); for (let q = 1; q <= 36; q++) submit_answer(q, get_hash(q, 1, true));');
  assert.equal(app.run('finished'), false);
  assert.equal(app.element('progress-summary').textContent, '36 answered; 0 unanswered.');
  assert.match(app.element('completion-hint').textContent, /still review/);
  const reloaded = load({ store: app.store, now: 2000 });
  assert.equal(reloaded.run('finished'), false);
  reloaded.run('go_to_question(1); submit_answer(1, get_hash(1, 2, true)); request_finish(); finish_test();');
  assert.equal(reloaded.element('score').textContent, '35 / 36 correct');
});

test('finishing with skipped questions requires confirmation and survives reload', () => {
  const app = load();
  app.run('start_test(); go_to_question(20); submit_answer(20, get_hash(20, 1, true)); finish_test();');
  assert.equal(app.run('finished'), false);
  app.element('finish-link').events.click();
  assert.match(app.element('finish-count').textContent, /1 answered; 35 unanswered/);
  app.element('finish-cancel').events.click();
  assert.equal(app.element('finish-review').hidden, true);
  assert.equal(app.run('finished'), false);
  app.element('finish-link').events.click();
  app.element('finish-confirm').events.click();
  assert.equal(app.element('score').textContent, '1 / 36 correct');
  const reloaded = load({ store: app.store, now: 2000 });
  assert.equal(reloaded.element('answered-count').textContent, '1 answered; 35 unanswered.');
  assert.equal(reloaded.element('result-reason').textContent, 'Test completed.');
});

test('time expiry during review blocks navigation and answer changes, retaining sparse score', () => {
  const app = load();
  app.run('start_test(); go_to_question(36); submit_answer(36, get_hash(36, 1, true)); request_finish()');
  app.advance(40 * 60 * 1000);
  app.run('go_to_question(36); submit_answer(36, get_hash(36, 2, true)); finish_test();');
  assert.match(app.element('result-reason').textContent, /Time is up/);
  assert.equal(app.element('score').textContent, '1 / 36 correct');
  assert.equal(app.element('answered-count').textContent, '1 answered; 35 unanswered.');
  assert.equal(app.intervals.size, 0);
});

test('version 1 attempts migrate without losing answers, deadline or completed results', () => {
  const helper = load();
  const saved = { version: 1, startedAt: 1000, answers: [helper.run('get_hash(1, 1, true)')], completed: false, timedOut: false };
  const store = new Map([['iqchampion.attempt.v1', JSON.stringify(saved)]]);
  const migrated = load({ store, now: 61000 });
  assert.equal(migrated.element('question-number').textContent, 'Question 2 / 36');
  assert.equal(migrated.element('time-left').textContent, '39:00');
  assert.equal(migrated.run('answered_count()'), 1);
  assert.equal(JSON.parse(store.get('iqchampion.attempt.v1')).version, 2);
  saved.completed = true;
  saved.timedOut = true;
  const result = load({ store: new Map([['iqchampion.attempt.v1', JSON.stringify(saved)]]), now: 2500000 });
  assert.equal(result.element('score').textContent, '1 / 36 correct');
  assert.match(result.element('result-reason').textContent, /Time is up/);
});

test('new save validation rejects invalid positions and answer arrays', () => {
  const valid = { version: 2, startedAt: 1000, answers: Array(36).fill(null), currentQuestion: 1, completed: false, timedOut: false };
  for (const saved of [{ ...valid, currentQuestion: 0 }, { ...valid, currentQuestion: 37 },
    { ...valid, answers: [] }, { ...valid, answers: [null, 'invalid', ...Array(34).fill(null)] }]) {
    const app = load({ store: new Map([['iqchampion.attempt.v1', JSON.stringify(saved)]]) });
    assert.match(app.element('storage-notice').textContent, /could not be restored/);
    assert.equal(app.intervals.size, 0);
  }
});

test('answer review is unavailable before starting and while an attempt is active', () => {
  const app = load();
  app.run('show_answer_review(1)');
  assert.equal(app.element('review-correct').children.length, 0);
  assert.equal(app.store.size, 0);
  app.run('start_test(); show_answer_review(1)');
  assert.equal(app.element('answer-review').hidden, true);
  assert.equal(app.element('review-correct').children.length, 0);
  assert.equal(app.run('finished'), false);
});

test('review classifies every question and shows the exact saved answer and correct image', () => {
  const app = load();
  app.run('start_test(); submit_answer(1, get_hash(1, 1, true)); submit_answer(2, get_hash(2, 5, true)); go_to_question(36); submit_answer(36, get_hash(36, 1, true)); request_finish(); finish_test(); show_answer_review(2);');
  assert.equal(app.element('review-summary').textContent, '2 correct; 1 incorrect; 33 unanswered.');
  assert.equal(app.element('score').textContent, '2 / 36 correct');
  assert.match(app.element('review-outcome').textContent, /^Incorrect/);
  assert.equal(app.element('review-selected').children[0].src, app.run('get_picture_path(2, 5, true)'));
  assert.equal(app.element('review-correct').children[0].src, app.run('get_picture_path(2, 1, true)'));
  assert.equal(app.element('review-pattern').innerHTML, app.run('question_markup(2)'));
  const overview = app.element('review-overview').children;
  assert.equal(overview.length, 36);
  assert.equal(overview[0].attributes['aria-label'], 'Review question 1, correct');
  assert.equal(overview[1].attributes['aria-label'], 'Review question 2, incorrect');
  assert.equal(overview[1].attributes['aria-current'], 'step');
  assert.equal(overview[2].attributes['aria-label'], 'Review question 3, unanswered');
  overview[2].events.click();
  assert.match(app.element('review-outcome').textContent, /^Unanswered/);
  assert.equal(app.element('review-selected').textContent, 'No answer submitted');
  assert.equal(app.element('review-selected').children.length, 0);
  assert.equal(app.element('review-correct').children.length, 1);
  app.run('show_answer_review(1)');
  assert.match(app.element('review-outcome').textContent, /^Correct/);
  assert.equal(app.element('review-selected').children[0].src, app.element('review-correct').children[0].src);
  assert.equal(app.element('review-previous').disabled, true);
  app.run('show_answer_review(36)');
  assert.equal(app.element('review-next').disabled, true);
});

test('review navigation and attempted edits cannot change a completed score or saved attempt', () => {
  const app = load();
  app.run('start_test(); submit_answer(1, get_hash(1, 1, true)); request_finish(); finish_test();');
  const before = app.store.get('iqchampion.attempt.v1');
  const score = app.element('score').textContent;
  app.element('answer-review-link').events.click();
  app.element('review-next').events.click();
  assert.equal(app.element('answer-review-title').textContent, 'Review question 2 / 36');
  app.element('review-previous').events.click();
  app.run('show_answer_review(0); show_answer_review(37); submit_answer(1, get_hash(1, 2, true)); go_to_question(3);');
  assert.equal(app.element('answer-review-title').textContent, 'Review question 1 / 36');
  app.element('review-back').events.click();
  assert.equal(app.element('answer-review').hidden, true);
  assert.equal(app.element('result').hidden, false);
  assert.equal(app.element('score').textContent, score);
  assert.equal(app.store.get('iqchampion.attempt.v1'), before);
  assert.equal(app.intervals.size, 0);
});

test('expired attempts can be reviewed after reopening, with unanswered questions kept separate', () => {
  const first = load();
  first.run('start_test(); go_to_question(12); submit_answer(12, get_hash(12, 2, true));');
  const reloaded = load({ store: first.store, now: 1000 + 40 * 60 * 1000 });
  reloaded.run('show_answer_review(12)');
  assert.equal(reloaded.element('answer-review').hidden, false);
  assert.equal(reloaded.element('review-summary').textContent, '0 correct; 1 incorrect; 35 unanswered.');
  assert.equal(reloaded.element('review-selected').children[0].src, reloaded.run('get_picture_path(12, 2, true)'));
  const again = load({ store: first.store, now: 1000 + 41 * 60 * 1000 });
  again.run('show_answer_review(12)');
  assert.equal(again.element('review-summary').textContent, reloaded.element('review-summary').textContent);
});

test('previously completed version 1 results support review without a new attempt', () => {
  const helper = load();
  const saved = { version: 1, startedAt: 1000, answers: [helper.run('get_hash(1, 1, true)')], completed: true, timedOut: true };
  const app = load({ store: new Map([['iqchampion.attempt.v1', JSON.stringify(saved)]]), now: 2500000 });
  app.run('show_answer_review(1)');
  assert.equal(app.element('review-summary').textContent, '1 correct; 0 incorrect; 35 unanswered.');
  assert.equal(app.run('started_at'), 1000);
  assert.equal(app.intervals.size, 0);
});

test('starting again or reconciling another tab hides the previous answer review', () => {
  const first = load();
  first.run('start_test(); request_finish(); finish_test(); show_answer_review(1)');
  first.element('restart-link').events.click();
  assert.equal(first.element('answer-review').hidden, true);
  first.run('show_answer_review(1)');
  const second = load({ store: first.store });
  second.run('start_test()');
  first.run('show_answer_review(1)');
  assert.equal(first.element('answer-review').hidden, true);
  assert.equal(first.run('finished'), false);
});


test('usage events follow new starts and finishes, without reporting a restored result', () => {
  const events = [];
  const tracker = { event: (...args) => events.push(args) };
  const first = load({ tracker });
  first.run('show_practice(); answer_practice("square");');
  assert.deepEqual(events, []);
  first.run('start_test(); start_test(); request_finish(); finish_test(); finish_test();');
  assert.deepEqual(events, [['used'], ['test_completed']]);
  const restored = load({ tracker, store: first.store, now: 2000 });
  restored.run('return_to_result(); show_answer_review(1);');
  assert.deepEqual(events, [['used'], ['test_completed']]);
});

test('reloading a running test preserves time without counting another start', () => {
  const events = [];
  const tracker = { event: name => events.push(name) };
  const first = load({ tracker });
  first.run('start_test()');
  const resumed = load({ tracker, store: first.store, now: 2000 });
  assert.deepEqual(events, ['used']);
  resumed.advance(40 * 60 * 1000);
  resumed.run('update_timer(); update_timer();');
  load({ tracker, store: resumed.store, now: 2500000 });
  assert.deepEqual(events, ['used', 'test_completed']);
});

test('an attempt first found expired on reload reports completion once', () => {
  const events = [];
  const tracker = { event: name => events.push(name) };
  const first = load({ tracker });
  first.run('start_test()');
  load({ tracker, store: first.store, now: 2500000 });
  load({ tracker, store: first.store, now: 2501000 });
  assert.deepEqual(events, ['used', 'test_completed']);
});

test('a blocked or failing tracker cannot prevent starting and completing a test', () => {
  const app = load({ tracker: { event() { throw Error('Blocked'); } } });
  app.run('start_test(); request_finish(); finish_test();');
  assert.equal(app.element('score').textContent, '0 / 36 correct');
});
