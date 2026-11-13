'use strict';

const total_questions = 36;
const time_limit_ms = 40 * 60 * 1000;
const storage_key = 'iqchampion.attempt.v1';
// These are recorded durations, not independently verified testing conditions.
const reference_scores = time_and_scores.filter(row => row[0] > 60 && row[0] <= 2400);
let answers = [];
let started_at = null;
let deadline = null;
let timer_id = null;
let finished = true;
let timed_out = false;
let last_saved = null;

function storage_notice(message) {
  const notice = document.getElementById('storage-notice');
  notice.textContent = message;
  notice.hidden = !message;
}

function save_attempt() {
  const data = JSON.stringify({ version: 1, startedAt: started_at, answers, completed: finished, timedOut: timed_out });
  try {
    localStorage.setItem(storage_key, data);
    last_saved = data;
    storage_notice('');
  } catch {
    storage_notice('This browser could not save your attempt. Keep this page open: reloading may lose progress or restore older answers.');
  }
}

function valid_attempt(saved) {
  return saved && saved.version === 1
    && Number.isSafeInteger(saved.startedAt) && saved.startedAt > 0 && saved.startedAt <= Date.now()
    && typeof saved.completed === 'boolean' && typeof saved.timedOut === 'boolean'
    && (!saved.timedOut || saved.completed)
    && (!saved.completed || saved.timedOut || saved.answers?.length === total_questions)
    && Array.isArray(saved.answers) && saved.answers.length <= total_questions
    && saved.answers.every((answer, index) => typeof answer === 'string'
      && Array.from({ length: 9 }, (_, i) => get_hash(index + 1, i + 1, true)).includes(answer));
}

function restore_attempt() {
  let raw;
  try {
    raw = localStorage.getItem(storage_key);
  } catch {
    storage_notice('Local saving is unavailable in this browser. Keep this page open to avoid losing your attempt.');
    return false;
  }
  if (!raw || raw === last_saved) return false;
  let saved;
  try {
    saved = JSON.parse(raw);
    if (!valid_attempt(saved)) throw new Error('Invalid saved attempt');
  } catch {
    try { localStorage.removeItem(storage_key); } catch { /* The notice also covers unavailable storage. */ }
    storage_notice('The saved attempt could not be restored. Start a new test when you are ready.');
    return false;
  }
  last_saved = raw;
  clearInterval(timer_id);
  timer_id = null;
  started_at = saved.startedAt;
  deadline = started_at + time_limit_ms;
  answers = saved.answers.slice();
  timed_out = saved.timedOut;
  finished = false;
  document.getElementById('front').hidden = true;
  document.getElementById('practice').hidden = true;
  document.getElementById('result').hidden = true;
  document.getElementById('test').hidden = false;
  if (saved.completed || answers.length === total_questions || Date.now() >= deadline) {
    show_result(saved.completed ? saved.timedOut : answers.length < total_questions);
  } else {
    show_question(answers.length + 1);
    update_timer();
    if (!finished) timer_id = setInterval(update_timer, 250);
  }
  return true;
}

function show_practice() {
  if (!finished) return;
  document.getElementById('front').hidden = true;
  document.getElementById('result').hidden = true;
  document.getElementById('practice').hidden = false;
  document.getElementById('practice-feedback').textContent = 'This puzzle is unscored. You can try as many times as you like.';
  document.getElementById('practice-title').focus();
}

function answer_practice(shape) {
  document.getElementById('practice-feedback').textContent = shape === 'square'
    ? 'Correct! Circle and square alternate, so the missing shape is a square. In the test, selecting an answer moves straight to the next question.'
    : 'Try again. The shapes alternate between circle and square. What comes after a circle?';
}

function get_random_indexes(start, end) {
  const indexes = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

function get_hash(test_id, pic_id, is_answer) {
  if (is_answer) pic_id += 11;
  return md5('' + test_id + String(pic_id).padStart(2, '0'));
}

function get_picture_path(test_id, pic_id, is_answer) {
  if (!is_answer && pic_id === 12) return 'images/questionmark.png';
  return 'tests/test' + test_id + '/' + get_hash(test_id, pic_id, is_answer) + '.png';
}

function preload_question(test_id) {
  for (let pic_id = 1; pic_id <= 20; pic_id++) {
    const image = new Image();
    image.src = pic_id <= 11 ? get_picture_path(test_id, pic_id, false)
      : get_picture_path(test_id, pic_id - 11, true);
  }
}

function show_question(test_id) {
  let html = '';
  for (let row = 0; row < 4; row++) {
    html += '<div class="pattern-row">';
    for (let column = 0; column < 3; column++) {
      const pic_id = row * 3 + column + 1;
      const alt = pic_id === 12 ? 'Missing icon' : `Row ${row + 1}, icon ${column + 1}`;
      html += `<img class="${pic_id === 12 ? 'missing' : 'icon'}" src="${get_picture_path(test_id, pic_id, false)}" alt="${alt}">`;
      if (column < 2) html += '<img class="arrow" src="images/arrow.png" alt="">';
    }
    html += '</div>';
  }
  const heading = document.getElementById('question-number');
  heading.textContent = `Question ${test_id} / ${total_questions}`;
  document.getElementById('test-left').innerHTML = html;
  const container = document.getElementById('test-right');
  container.replaceChildren();
  get_random_indexes(1, 9).forEach((pic_id, position) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer';
    button.setAttribute('aria-label', `Answer ${position + 1}`);
    const image = new Image();
    image.src = get_picture_path(test_id, pic_id, true);
    image.alt = '';
    image.className = 'icon';
    button.append(image);
    button.addEventListener('click', () => submit_answer(test_id, get_hash(test_id, pic_id, true)));
    container.append(button);
  });
  heading.focus();
  if (test_id < total_questions) preload_question(test_id + 1);
}

function update_timer() {
  // Reconcile another tab's progress before a timeout can persist older answers.
  if (restore_attempt()) return;
  if (finished) return;
  const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  document.getElementById('time-left').textContent =
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  document.querySelector('.timer').classList.toggle('urgent', seconds <= 300);
  const warning = seconds <= 300 ? 'Five minutes or less remaining.' : '';
  const status = document.getElementById('time-warning');
  if (status.textContent !== warning) status.textContent = warning;
  if (seconds === 0) show_result(true);
}

function submit_answer(test_id, answer) {
  // Pick up another tab's saved progress before accepting a possibly stale answer.
  restore_attempt();
  if (finished) return;
  // Background tabs can delay timer callbacks, so check the deadline on every answer.
  if (Date.now() >= deadline) {
    update_timer();
    return;
  }
  if (test_id !== answers.length + 1) return;
  const valid_answers = Array.from({ length: 9 }, (_, i) => get_hash(test_id, i + 1, true));
  if (!valid_answers.includes(answer)) return;
  answers.push(answer);
  save_attempt();
  if (answers.length === total_questions) show_result(false);
  else show_question(test_id + 1);
}

function calculate_score(submitted_answers, reference) {
  const correct = submitted_answers.slice(0, total_questions)
    .reduce((sum, answer, index) => sum + (answer === get_hash(index + 1, 1, true) ? 1 : 0), 0);
  const below = reference.filter(row => row[1] < correct).length;
  const equal = reference.filter(row => row[1] === correct).length;
  return {
    correct,
    below_percent: reference.length ? 100 * below / reference.length : null,
    equal_percent: reference.length ? 100 * equal / reference.length : null,
    // Midrank: tied participants share the middle of their percentile group.
    percentile: reference.length ? 100 * (below + equal / 2) / reference.length : null
  };
}

function format_percent(value) {
  if (value > 99.9 && value < 100) return '>99.9';
  if (value > 0 && value < 0.1) return '<0.1';
  return value.toFixed(1);
}

function show_result(expired) {
  if (finished) return;
  finished = true;
  // Store completion too, so reloading a result never creates a fresh timer.
  timed_out = expired;
  clearInterval(timer_id);
  timer_id = null;
  save_attempt();
  const result = calculate_score(answers, reference_scores);
  document.getElementById('test').hidden = true;
  document.getElementById('result').hidden = false;
  document.getElementById('result-reason').textContent = expired ? 'Time is up. Your answers have been scored.' : 'Test completed.';
  document.getElementById('score').textContent = `${result.correct} / ${total_questions} correct`;
  document.getElementById('answered-count').textContent = `${answers.length} answered; ${total_questions - answers.length} unanswered.`;
  document.getElementById('percentile').textContent = result.percentile === null
    ? 'Comparison unavailable.' : `Percentile among historical participants: ${format_percent(result.percentile)}`;
  document.getElementById('comparison').textContent = result.percentile === null ? ''
    : `Participants scoring lower: ${format_percent(result.below_percent)}%. Participants with the same score: ${format_percent(result.equal_percent)}%.`;
  document.getElementById('result-context').textContent =
    `Reference group: ${reference_scores.length.toLocaleString('en-US')} historical attempts with recorded durations over one minute and up to 40 minutes. Participants were recruited through paid Facebook ads and chose to take the test. This self-selected group may differ from the general population; the direction and size of any difference are unknown. No population adjustment has been applied. The percentile places tied scores at the middle of their group. Historical timing conditions and data exclusions have not been independently verified. Practice and repeated attempts may affect comparability with historical results.`;
  document.getElementById('result-title').focus();
}

function start_test() {
  restore_attempt();
  if (!finished) return;
  clearInterval(timer_id);
  answers = [];
  started_at = Date.now();
  deadline = started_at + time_limit_ms;
  finished = false;
  timed_out = false;
  document.getElementById('front').hidden = true;
  document.getElementById('result').hidden = true;
  document.getElementById('practice').hidden = true;
  document.getElementById('test').hidden = false;
  save_attempt();
  update_timer();
  show_question(1);
  timer_id = setInterval(update_timer, 250);
}

document.getElementById('reference-count').textContent = reference_scores.length.toLocaleString('en-US');
document.getElementById('start-link').addEventListener('click', show_practice);
document.getElementById('restart-link').addEventListener('click', show_practice);
document.getElementById('practice-start-link').addEventListener('click', start_test);
for (const shape of ['circle', 'square', 'triangle']) {
  document.getElementById('practice-' + shape).addEventListener('click', () => answer_practice(shape));
}
document.addEventListener('visibilitychange', update_timer);
window.addEventListener('focus', update_timer);
window.addEventListener('storage', event => {
  if (event.key === storage_key) restore_attempt();
});
preload_question(1);
restore_attempt();
