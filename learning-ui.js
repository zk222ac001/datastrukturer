'use strict';
(() => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Reusable scoped quiz view. A future lesson supplies questions, model and onComplete.
  function mountQuiz(root, { quiz, id, onComplete }) {
    function draw() {
      const result = quiz.result();
      root.innerHTML = `<h3>Check your understanding</h3><p>Choose one answer per question. Each choice is final for this attempt. Retry to start again.</p>${quiz.questions.map((q, i) => {
        const answered = quiz.answers[i] !== null;
        const correct = quiz.answers[i] === q.answer;
        return `<fieldset class="quiz-question"><legend>${i + 1}. ${esc(q.prompt)}</legend>${q.code ? `<pre dir="ltr" tabindex="0"><code>${esc(q.code)}</code></pre>` : ''}<div class="quiz-options">${q.options.map((option, choice) => `<label><input type="radio" name="${id}-${i}" data-question="${i}" value="${choice}" ${quiz.answers[i] === choice ? 'checked' : ''} ${answered ? 'disabled' : ''}><span>${esc(option)}</span></label>`).join('')}</div><p id="${id}-feedback-${i}" class="quiz-feedback" role="status">${answered ? `${correct ? 'Correct.' : 'Not quite.'} ${esc(q.explanation)}` : ''}</p></fieldset>`;
      }).join('')}<p role="status" class="quiz-score">${result.complete ? `Score: ${result.score} / ${result.total}. Your result has been recorded.` : `${result.answered} / ${result.total} answered.`}</p><button type="button" data-quiz-retry>Retry quiz</button>`;
    }
    root.addEventListener('change', e => {
      const input = e.target.closest('[data-question]');
      if (!input) return;
      const i = Number(input.dataset.question);
      quiz.answer(i, Number(input.value));
      if (quiz.result().complete) onComplete?.(quiz.result());
      draw();
      // Replacing a disabled radio would otherwise drop keyboard focus to the body.
      const feedback = root.querySelector(`#${id}-feedback-${i}`);
      feedback.setAttribute('tabindex', '-1');
      feedback.focus();
    });
    root.addEventListener('click', e => {
      if (!e.target.closest('[data-quiz-retry]')) return;
      quiz.retry(); draw(); root.querySelector('input')?.focus();
    });
    draw();
  }
  window.CodeVizLearningUI = { esc, mountQuiz };
})();
