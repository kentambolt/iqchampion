const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

let uuidSequence = 0;
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
  const pageLocation = { pathname:options.path || '/', search:options.search || '', hash:options.hash || '' };
  const pageHistory = { replaceState(_state,_title,value) { const url = new URL(value,'https://iqchampion.com'); pageLocation.pathname=url.pathname; pageLocation.search=url.search; pageLocation.hash=url.hash; } };
  const intervals = new Set();
  const context = vm.createContext({
    crypto: {randomUUID() { if(options.failCrypto) throw Error("Unavailable"); return "00000000-0000-4000-8000-"+String(++uuidSequence).padStart(12,"0"); }},
    location:pageLocation, history:pageHistory, Date: { now: () => now }, Image: class {}, localStorage: storage, navigator: { language: options.language || 'en', doNotTrack:options.dnt, globalPrivacyControl:options.gpc },
    document: { documentElement: makeElement(), getElementById: element, querySelector: element, createElement: makeElement, addEventListener() {} },
    window: { doNotTrack: options.windowDnt, MuntheSystems: options.tracker, addEventListener(event, handler) { windowEvents[event] = handler; } },
    setInterval(callback) { intervals.add(callback); return callback; },
    clearInterval(id) { intervals.delete(id); }
  });
  for (const file of ['time_and_scores.js', 'percentiles.js', 'iq-score.js', 'md5.js', 'explanations.js', 'i18n.js', 'test-start-intents.js', 'app.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets', file), 'utf8'), context);
  }
  return { run: code => vm.runInContext(code, context), element, intervals, store, windowEvents, pageLocation, advance: ms => { now += ms; } };
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
    const app = load({ store: new Map([['iqchampion.attempt.v4', raw]]) });
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
  second.windowEvents.storage({ key: 'iqchampion.attempt.v4' });
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
  assert.equal(JSON.parse(store.get('iqchampion.attempt.v4')).version, 2);
  saved.completed = true;
  saved.timedOut = true;
  const result = load({ store: new Map([['iqchampion.attempt.v4', JSON.stringify(saved)]]), now: 2500000 });
  assert.equal(result.element('score').textContent, '1 / 36 correct');
  assert.match(result.element('result-reason').textContent, /Time is up/);
});

test('new save validation rejects invalid positions and answer arrays', () => {
  const valid = { version: 2, startedAt: 1000, answers: Array(36).fill(null), currentQuestion: 1, completed: false, timedOut: false };
  for (const saved of [{ ...valid, currentQuestion: 0 }, { ...valid, currentQuestion: 37 },
    { ...valid, answers: [] }, { ...valid, answers: [null, 'invalid', ...Array(34).fill(null)] }]) {
    const app = load({ store: new Map([['iqchampion.attempt.v4', JSON.stringify(saved)]]) });
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
  const before = app.store.get('iqchampion.attempt.v4');
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
  assert.equal(app.store.get('iqchampion.attempt.v4'), before);
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
  const app = load({ store: new Map([['iqchampion.attempt.v4', JSON.stringify(saved)]]), now: 2500000 });
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


test('Danish practice, active test and accessible answers are translated', () => {
  const app = load({language:'da-DK'});
  app.run('show_practice(); answer_practice("circle");');
  assert.match(app.element('practice-feedback').textContent, /^Prøv igen/);
  app.run('answer_practice("square")');
  assert.match(app.element('practice-feedback').textContent, /^Rigtigt!/);
  assert.equal(app.intervals.size, 0);
  app.run('start_test(); request_finish()');
  assert.equal(app.element('question-number').textContent, 'Opgave 1 / 36');
  assert.equal(app.element('test-right').children[0].attributes['aria-label'], 'Svar 1');
  assert.match(app.element('test-left').innerHTML, /Række 1, figur 1/);
  assert.match(app.element('finish-count').textContent, /Når du har afsluttet, kan du ikke rette dine svar/);
  assert.match(app.element('feedback-link').attributes.href, /lang=da$/);
  assert.deepEqual(Array.from(app.run('i18n.missing')), []);
});

test('switching language preserves answers, deadline, question, answer order and events', () => {
  const events = [];
  const app = load({tracker:{event:name=>events.push(name)}});
  app.run('start_test(); submit_answer(1,get_hash(1,1,true)); go_to_question(4)');
  const stored = app.store.get('iqchampion.attempt.v4');
  const buttons = [...app.element('test-right').children];
  app.run('i18n.setLanguage("da")');
  assert.equal(app.element('question-number').textContent, 'Opgave 4 / 36');
  assert.equal(app.element('progress-summary').textContent, '1 besvaret; 35 ubesvarede.');
  assert.deepEqual(app.element('test-right').children, buttons);
  assert.equal(app.store.get('iqchampion.attempt.v4'), stored);
  assert.equal(app.run('deadline'), 2401000);
  assert.deepEqual(events, ['used']);
  const resumed = load({store:app.store, now:61000, language:'en-US'});
  assert.equal(resumed.run('i18n.language'), 'da');
  assert.equal(resumed.element('time-left').textContent, '39:00');
  assert.equal(resumed.element('question-number').textContent, 'Opgave 4 / 36');
  resumed.run('i18n.setLanguage("en")');
  assert.equal(resumed.element('question-number').textContent, 'Question 4 / 36');
  assert.match(resumed.element('feedback-link').attributes.href, /lang=en$/);
});

test('Danish timeout, method, decimals and read-only answer review remain bilingual', () => {
  const app = load({language:'da'});
  app.run('start_test(); submit_answer(1,get_hash(1,1,true)); submit_answer(2,get_hash(2,2,true));');
  app.advance(35 * 60 * 1000); app.run('update_timer()');
  assert.equal(app.element('time-warning').textContent, 'Der er højst fem minutter tilbage.');
  app.advance(5 * 60 * 1000); app.run('update_timer()');
  assert.match(app.element('result-reason').textContent, /^Tiden er gået/);
  assert.equal(app.element('score').textContent, '1 / 36 rigtige');
  assert.match(app.element('result-context').textContent, /^Sammenligningsgruppe: 10.216/);
  assert.match(app.element('percentile').textContent, /Percentil.*,/);
  app.run('show_answer_review(1)');
  assert.match(app.element('review-summary').textContent, /1 rigtig; 1 forkert; 34 ubesvarede/);
  assert.match(app.element('review-outcome').textContent, /^Rigtigt/);
  app.run('show_answer_review(2)'); assert.match(app.element('review-outcome').textContent, /^Forkert/);
  app.run('show_answer_review(3)'); assert.equal(app.element('review-selected').textContent, 'Intet svar afgivet');
  assert.equal(app.element('review-correct').children[0].alt, 'Rigtigt svar');
  assert.deepEqual(Array.from(app.run('i18n.missing')), []);
  app.run('i18n.setLanguage("en")');
  assert.match(app.element('result-reason').textContent, /^Time is up/);
  assert.equal(app.element('score').textContent, '1 / 36 correct');
  assert.equal(app.element('review-selected').textContent, 'No answer submitted');
  assert.equal(app.element('review-correct').children[0].alt, 'Correct answer');
  assert.equal(app.intervals.size, 0);
});

test('Danish storage failures and corrupt attempts have localized recoverable messages', () => {
  const app = load({language:'da', failWrite:true});
  app.run('start_test(); i18n.setLanguage("da")');
  assert.match(app.element('storage-notice').textContent, /^Browseren kunne ikke gemme/);
  assert.equal(app.run('finished'), false);
  const blocked = load({language:'da', failRead:true});
  assert.match(blocked.element('storage-notice').textContent, /^Lokal lagring/);
  const corrupt = load({language:'da', store:new Map([['iqchampion.attempt.v4','invalid']])});
  assert.match(corrupt.element('storage-notice').textContent, /^Det gemte forsøg kunne ikke gendannes/);
});

test('unsupported locales fall back to English; an explicit valid choice wins over browser language', () => {
  const fallback = load({language:'fr-FR'});
  assert.equal(fallback.run('i18n.language'), 'en');
  fallback.run('i18n.setLanguage("de")'); assert.equal(fallback.run('i18n.language'), 'en');
  const saved = load({language:'da-DK', store:new Map([['iqchampion.language','en']])});
  assert.equal(saved.run('i18n.language'), 'en');
});

test('all static product copy and accessibility labels have Danish translations', () => {
  const app = load({language:'da'});
  const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8').replace(/<(noscript|script)[^>]*>[\s\S]*?<\/\1>/g,'');
  const decode = s => s.replace(/&amp;/g,'&').trim();
  const texts = [...html.matchAll(/>([^<>]+)</g)].map(m=>decode(m[1])).filter(Boolean);
  const attributes = [...html.matchAll(/(?:aria-label|alt)="([^"]*)"/g)].map(m=>decode(m[1]));
  for(const m of html.matchAll(/<meta[^>]*(?:name="description"|property="og:(?:title|description)")[^>]*content="([^"]*)"/g)) attributes.push(decode(m[1]));
  for(const value of [...texts,...attributes]) app.run('i18n.translate('+JSON.stringify(value)+')');
  assert.deepEqual(Array.from(app.run('i18n.missing')), []);
});


test('switching language after an unanswered review cannot replace a submitted answer image', () => {
  const app = load();
  app.run('start_test(); submit_answer(1,get_hash(1,1,true)); request_finish(); finish_test(); show_answer_review(3); show_answer_review(1);');
  const image = app.element('review-selected').children[0];
  app.run('i18n.setLanguage("da")');
  assert.equal(app.element('review-selected').children[0],image);
  assert.equal(image.alt,'Dit indsendte svar');
  assert.equal(app.element('review-selected').textContent,'');
});


test('explicit real language routes override saved and browser preferences without redirecting on load', () => {
  const app = load({path:'/da/',language:'en',store:new Map([['iqchampion.language','en']])});
  assert.equal(app.run('i18n.language'),'da');
  assert.equal(app.pageLocation.pathname,'/da/');
  assert.match(app.run('document.title'),/^Gratis logiktest/);
  const english = load({path:'/en/index.html',language:'da',store:new Map([['iqchampion.language','da']])});
  assert.equal(english.run('i18n.language'),'en');
  assert.equal(english.pageLocation.pathname,'/en/index.html');
});

test('language route switches preserve active answers/deadline and update canonical metadata', () => {
  const app = load({path:'/en/',search:'?campaign=sample',hash:'#intro'});
  app.run('start_test(); submit_answer(1,get_hash(1,1,true));');
  const before = app.store.get('iqchampion.attempt.v4');
  app.run('i18n.setLanguage("da")');
  assert.equal(app.pageLocation.pathname,'/da/');
  assert.equal(app.pageLocation.search,'?campaign=sample');
  assert.equal(app.store.get('iqchampion.attempt.v4'),before);
  assert.equal(app.run('deadline'),2401000);
  assert.equal(app.element('link[rel="canonical"]').attributes.href,'https://iqchampion.com/da/');
  assert.equal(JSON.parse(app.element('site-schema').textContent).url,'https://iqchampion.com/da/');
  assert.equal(app.element('language-da').attributes['aria-current'],'page');
  app.run('i18n.setLanguage("en")');
  assert.equal(app.pageLocation.pathname,'/en/');
  assert.equal(app.store.get('iqchampion.attempt.v4'),before);
});


test('IQ-style conversion matches normal-scale anchors and bounds unsupported tails', () => {
  const app = load();
  for (const [p, expected] of [[50,'100'],[15.865525,'85'],[84.134474,'115'],[2.275006,'70'],[97.724994,'130'],[0,'≤55'],[100,'≥145']])
    assert.equal(app.run('estimate_iq('+p+')'), expected);
  for (const bad of ['null','NaN','Infinity','-1','101']) assert.equal(app.run('estimate_iq('+bad+')'), null);
  const values = Array.from(app.run('Array.from({length:37},(_,n)=>{const p=calculate_score(Array.from({length:36},(_,i)=>get_hash(i+1,i<n?1:2,true)),reference_scores).percentile;return Number(estimate_iq(p).replace(/[≤≥]/g,""));})'));
  assert.equal(values.every((v,i)=>Number.isFinite(v)&&(!i||v>=values[i-1])),true);
});

test('IQ estimate survives reload and language changes, with partial-attempt qualification', () => {
  const app=load({language:'da'});
  app.run('start_test(); for(let i=1;i<=36;i++) submit_answer(i,get_hash(i,i<=25?1:2,true)); request_finish(); finish_test();');
  const estimate=app.element('iq-estimate').textContent;
  assert.match(estimate,/^(?:[≤≥])?\d+$/);
  assert.equal(app.element('iq-incomplete').hidden,true);
  assert.equal(app.element('score').textContent,'25 / 36 rigtige');
  app.run('i18n.setLanguage("en")');
  assert.equal(app.element('iq-estimate').textContent,estimate);
  const restored=load({store:app.store,now:120000,language:'en'});
  assert.equal(restored.element('iq-estimate').textContent,estimate);
  assert.equal(restored.element('score').textContent,'25 / 36 correct');
  assert.deepEqual(Array.from(app.run('i18n.missing')),[]);
  const partial=load();partial.run('start_test();submit_answer(1,get_hash(1,1,true));request_finish();finish_test();');
  assert.equal(partial.element('iq-incomplete').hidden,false);
  const empty=load();empty.run('start_test();request_finish();finish_test();');
  assert.equal(empty.element('iq-estimate').textContent,'—');
});


test('question 36 corrections are versioned without changing saved answers or deadlines', () => {
 const app=load();app.run('start_test();submit_answer(1,get_hash(1,1,true));');
 assert.equal(app.run('puzzle_version'),3);
 assert.match(app.run('get_picture_path(36,8,false)'),/v2\/.*\.svg$/);
 assert.match(app.run('get_picture_path(36,1,true)'),/v2\/.*\.svg$/);
 const saved=JSON.parse(app.store.get('iqchampion.attempt.v4'));
 assert.equal(saved.puzzleVersion,3);
 const resumed=load({store:app.store,now:61000});
 assert.equal(resumed.run('puzzle_version'),3);
 assert.equal(resumed.element('time-left').textContent,'39:00');
 delete saved.puzzleVersion;app.store.set('iqchampion.attempt.v4',JSON.stringify(saved));
 const old=load({store:app.store,now:61000});
 assert.equal(old.run('puzzle_version'),1);
 assert.match(old.run('get_picture_path(36,8,false)'),/test36\/[^/]+\.png$/);
 assert.match(old.run('get_picture_path(36,1,true)'),/test36\/[^/]+\.png$/);
 old.run('submit_answer(2,get_hash(2,1,true))');
 assert.equal(JSON.parse(old.store.get('iqchampion.attempt.v4')).puzzleVersion,1);
 old.run('request_finish();finish_test();show_practice();start_test();');
 assert.equal(old.run('puzzle_version'),3);
});


test('only complete results expose a share link; share URLs contain no answers or browser parameters',()=>{
 const app=load({path:'/da/',search:'?private=value',hash:'#hidden'});
 app.run('start_test();submit_answer(1,get_hash(1,1,true));request_finish();finish_test();');
 assert.equal(app.element('iq-estimate').textContent,'—');
 assert.equal(app.element('share-result-link').hidden,true);
 app.run('show_practice();start_test();for(let i=1;i<=36;i++)submit_answer(i,get_hash(i,i<=25?1:2,true));request_finish();finish_test();');
 assert.equal(app.element('share-result-link').hidden,false);
 let url=new URL(app.element('share-result-link').attributes.href);
 assert.equal(url.hostname,'www.facebook.com');
 assert.equal(url.searchParams.get('u'),'https://iqchampion.com/share/da/25/');
 assert.equal([...url.searchParams].length,1);
 app.run('i18n.setLanguage("en")');
 url=new URL(app.element('share-result-link').attributes.href);
 assert.equal(url.searchParams.get('u'),'https://iqchampion.com/share/en/25/');
 assert.equal(new URL(app.element('share-test-link').attributes.href).searchParams.get('u'),'https://iqchampion.com/en/');
});


test('legacy open clients cannot overwrite or continuously restore versioned attempts',()=>{
 const helper=load();const legacy={version:2,startedAt:1000,answers:Array(36).fill(null),currentQuestion:36,completed:false,timedOut:false};
 const store=new Map([['iqchampion.attempt.v1',JSON.stringify(legacy)]]);
 const app=load({store,now:61000});
 assert.equal(app.run('puzzle_version'),1);
 assert.equal(app.run('current_question'),36);
 assert.equal(app.element('time-left').textContent,'39:00');
 assert.equal(JSON.parse(store.get('iqchampion.attempt.v4')).puzzleVersion,1);
 assert.equal(store.get('iqchampion.attempt.v1'),JSON.stringify(legacy));
 app.run('request_finish();finish_test();show_answer_review(36)');
 assert.equal(app.element('answer-review').hidden,false);
 // An old client saves the legacy key while this review is open.
 store.set('iqchampion.attempt.v1',JSON.stringify({...legacy,completed:true}));
 app.windowEvents.storage({key:'iqchampion.attempt.v1'});
 assert.equal(app.element('answer-review').hidden,false);
 app.run('return_to_result();show_practice();start_test();');
 assert.equal(app.run('puzzle_version'),3);
 const current=store.get('iqchampion.attempt.v4');
 store.set('iqchampion.attempt.v1',JSON.stringify({...legacy,completed:true}));
 app.windowEvents.storage({key:'iqchampion.attempt.v1'});
 assert.equal(store.get('iqchampion.attempt.v4'),current);
 assert.equal(app.run('puzzle_version'),3);
});


test('version2 attempts retain previous examples while new version3 attempts use disambiguated examples',()=>{
 const app=load();app.run('start_test();submit_answer(1,get_hash(1,1,true));');
 assert.match(app.run('get_picture_path(19,1,false)'),/test19\/v3\/.*\.svg$/);
 assert.match(app.run('get_picture_path(34,4,false)'),/test34\/v3\/.*\.svg$/);
 const saved=JSON.parse(app.store.get('iqchampion.attempt.v4'));saved.puzzleVersion=2;
 app.store.set('iqchampion.attempt.v4',JSON.stringify(saved));
 const old=load({store:app.store,now:61000});
 assert.equal(old.run('puzzle_version'),2);
 assert.equal(old.element('time-left').textContent,'39:00');
 assert.match(old.run('get_picture_path(19,1,false)'),/test19\/[^/]+\.png$/);
 assert.match(old.run('get_picture_path(34,4,false)'),/test34\/[^/]+\.png$/);
 assert.match(old.run('get_picture_path(36,8,false)'),/test36\/v2\/.*\.svg$/);
 assert.equal(old.run('get_hash(19,1,true)'),app.run('get_hash(19,1,true)'));
});


test('all 36 post-test explanations remain bilingual and follow the saved puzzle version',()=>{
 const app=load({language:'da'});app.run('start_test();request_finish();finish_test();');
 for(let id=1;id<=36;id++){
  app.run('show_answer_review('+id+')');
  assert.equal(app.element('explanation-title').textContent,app.run('question_explanations['+id+'].da.title'));
  assert.equal(app.element('explanation-rule').textContent,app.run('question_explanations['+id+'].da.rule'));
  assert.equal(app.element('explanation-legacy').hidden,true);
 }
 assert.deepEqual(Array.from(app.run('i18n.missing')),[]);
 app.run('i18n.setLanguage("en")');
 assert.equal(app.element('explanation-rule').textContent,app.run('question_explanations[36].rule'));
 const saved=JSON.parse(app.store.get('iqchampion.attempt.v4'));saved.puzzleVersion=1;
 app.store.set('iqchampion.attempt.v4',JSON.stringify(saved));
 const legacy=load({store:app.store});legacy.run('show_answer_review(36)');
 assert.match(legacy.element('explanation-application').textContent,/original version/);
 assert.equal(legacy.element('explanation-legacy').hidden,false);
 legacy.run('show_answer_review(19);i18n.setLanguage("da")');
 assert.match(legacy.element('explanation-legacy').textContent,/tidligere opgaveversion/);
 assert.deepEqual(Array.from(legacy.run('i18n.missing')),[]);
});


test('capture records exactly one anonymous intent for a real start, not practice or repeated clicks',()=>{
 const app=load();assert.equal(app.run('captured_test_start_intents().length'),0);
 app.run('show_practice();answer_practice("square");');
 assert.equal(app.run('captured_test_start_intents().length'),0);
 app.run('start_test();start_test();');
 const pending=JSON.parse(app.run('JSON.stringify(captured_test_start_intents())'));
 assert.equal(pending.length,1);assert.equal(pending[0].kind,'test_started');
 assert.deepEqual(Object.keys(pending[0]).sort(),['id','kind']);
 assert.match(pending[0].id,/^[0-9a-f-]{36}$/);
 const saved=JSON.parse(app.store.get('iqchampion.attempt.v4'));
 assert.equal(saved.completed,false);assert.equal(saved.startNotifications.mode,'capture');
 assert.equal(saved.startNotifications.pending[0].id,pending[0].id);
});

test('resume, refresh, language, navigation, review and timeout preserve the existing event ID',()=>{
 const first=load();first.run('start_test()');
 const before=first.run('JSON.stringify(captured_test_start_intents())');
 const resumed=load({store:first.store,now:61000});
 resumed.run('go_to_question(4);i18n.setLanguage("da");restore_attempt();');
 assert.equal(resumed.run('JSON.stringify(captured_test_start_intents())'),before);
 resumed.advance(40*60*1000);resumed.run('update_timer();show_answer_review(4);');
 assert.equal(resumed.run('JSON.stringify(captured_test_start_intents())'),before);
 const reopened=load({store:resumed.store,now:2500000});
 assert.equal(reopened.run('JSON.stringify(captured_test_start_intents())'),before);
});

test('a subsequent attempt retains pending intents and gets its own event ID even at the same clock time',()=>{
 const app=load();app.run('start_test();request_finish();finish_test();show_practice();start_test();');
 const pending=JSON.parse(app.run('JSON.stringify(captured_test_start_intents())'));
 assert.equal(pending.length,2);assert.notEqual(pending[0].id,pending[1].id);
 const reloaded=load({store:app.store});
 reloaded.run('request_finish();finish_test();show_practice();start_test();');
 assert.equal(reloaded.run('captured_test_start_intents().length'),3);
});

test('event availability follows the successful attempt storage write; failure never prevents taking the test',()=>{
 const blocked=load({failWrite:true});blocked.run('start_test()');
 assert.equal(blocked.run('captured_test_start_intents().length'),0);
 assert.equal(blocked.element('time-left').textContent,'40:00');
 assert.equal(blocked.element('storage-notice').hidden,false);
 const cryptoBlocked=load({failCrypto:true});cryptoBlocked.run('start_test()');
 assert.equal(cryptoBlocked.run('captured_test_start_intents().length'),0);
 assert.equal(cryptoBlocked.element('time-left').textContent,'40:00');
});

test('DNT and GPC suppress capture without affecting the test',()=>{
 for(const options of [{dnt:'1'},{dnt:'yes'},{gpc:true},{windowDnt:'1'}]){
  const app=load(options);app.run('start_test()');
  assert.equal(app.run('captured_test_start_intents().length'),0);
  assert.equal(app.element('time-left').textContent,'40:00');
 }
 const original=load();original.run('start_test()');
 const privateReload=load({store:original.store,gpc:true});
 assert.equal(privateReload.run('captured_test_start_intents().length'),0);
});

test('migration from v3 creates no retroactive intent and old clients cannot strip the new journal',()=>{
 const helper=load();const legacy={version:2,puzzleVersion:3,startedAt:1000,answers:Array(36).fill(null),currentQuestion:7,completed:false,timedOut:false};
 const store=new Map([['iqchampion.attempt.v3',JSON.stringify(legacy)]]);
 const app=load({store,now:61000});
 assert.equal(app.run('current_question'),7);assert.equal(app.element('time-left').textContent,'39:00');
 assert.equal(app.run('captured_test_start_intents().length'),0);
 assert.equal(store.get('iqchampion.attempt.v3'),JSON.stringify(legacy));
 app.run('request_finish();finish_test();show_practice();start_test();');
 const id=app.run('captured_test_start_intents()[0].id');
 store.set('iqchampion.attempt.v3',JSON.stringify({...legacy,completed:true}));
 app.windowEvents.storage({key:'iqchampion.attempt.v3'});
 assert.equal(app.run('captured_test_start_intents()[0].id'),id);
});

test('capture journal drops unknown fields, rejects unsafe modes and preserves a bounded backlog',()=>{
 const app=load();app.run('start_test()');
 const id=app.run('captured_test_start_intents()[0].id');
 const journal={version:1,mode:'capture',pending:[{id,kind:'test_started',email:'SYNTHETIC',answers:['SYNTHETIC']},{id,kind:'test_started'},{id:'bad',kind:'test_started'},{id,kind:'anything_else'}]};
 const cleaned=JSON.parse(app.run('JSON.stringify(test_start_intents.restore('+JSON.stringify(journal)+'))'));
 assert.deepEqual(cleaned.pending,[{id,kind:'test_started'}]);
 assert.equal(app.run('test_start_intents.restore({version:1,mode:"production",pending:[]}).mode'),'capture');
 app.run('for(let i=0;i<40;i++)start_notifications=test_start_intents.record(start_notifications)');
 assert.equal(app.run('start_notifications.pending.length'),32);
 const held=app.run('JSON.stringify(start_notifications)');
 app.run('start_notifications=test_start_intents.record(start_notifications)');
 assert.equal(app.run('JSON.stringify(start_notifications)'),held);
});
