'use strict';

const total_questions = 36;
const time_limit_ms = 40 * 60 * 1000;
// These are recorded durations, not independently verified testing conditions.
const reference_scores = time_and_scores.filter(row => row[0] > 60 && row[0] <= 2400);
let answers = [];
let deadline = null;
let timer_id = null;
let finished = true;

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

function show_result(timed_out) {
  if (finished) return;
  finished = true;
  clearInterval(timer_id);
  timer_id = null;
  const result = calculate_score(answers, reference_scores);
  document.getElementById('test').hidden = true;
  document.getElementById('result').hidden = false;
  document.getElementById('result-reason').textContent = timed_out ? 'Time is up. Your answers have been scored.' : 'Test completed.';
  document.getElementById('score').textContent = `${result.correct} / ${total_questions} correct`;
  document.getElementById('answered-count').textContent = `${answers.length} answered; ${total_questions - answers.length} unanswered.`;
  document.getElementById('percentile').textContent = result.percentile === null
    ? 'Comparison unavailable.' : `Percentile among historical participants: ${format_percent(result.percentile)}`;
  document.getElementById('comparison').textContent = result.percentile === null ? ''
    : `Participants scoring lower: ${format_percent(result.below_percent)}%. Participants with the same score: ${format_percent(result.equal_percent)}%.`;
  document.getElementById('result-context').textContent =
    `Reference group: ${reference_scores.length.toLocaleString('en-US')} historical attempts with recorded durations over one minute and up to 40 minutes. The percentile places tied scores at the middle of their group. Historical timing conditions have not been independently verified. Repeated attempts can benefit from familiarity with the puzzles.`;
  document.getElementById('result-title').focus();
}

function start_test() {
  clearInterval(timer_id);
  answers = [];
  deadline = Date.now() + time_limit_ms;
  finished = false;
  document.getElementById('front').hidden = true;
  document.getElementById('result').hidden = true;
  document.getElementById('test').hidden = false;
  update_timer();
  show_question(1);
  timer_id = setInterval(update_timer, 250);
}

document.getElementById('reference-count').textContent = reference_scores.length.toLocaleString('en-US');
document.getElementById('start-link').addEventListener('click', start_test);
document.getElementById('restart-link').addEventListener('click', start_test);
document.addEventListener('visibilitychange', update_timer);
window.addEventListener('focus', update_timer);
preload_question(1);
