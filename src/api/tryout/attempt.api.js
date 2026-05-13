import request from '../client';

// ======================================================
// START TRYOUT
// POST /tryout/{id_tryout}/start
// ======================================================

export async function startTryout(tryoutId) {
  return request(`/tryout/${tryoutId}/start`, {
    method: 'POST',
  });
}

// ======================================================
// GET QUESTIONS
// GET /tryout/attempt/{attempt_token}
// ======================================================

export async function getAttemptQuestions(attemptToken) {
  return request(`/tryout/attempt/${attemptToken}`);
}

// ======================================================
// SAVE ANSWERS
// PUT /tryout/attempt/{attempt_token}/answer
// ======================================================

export async function saveAttemptAnswers(attemptToken, answers) {
  return request(`/tryout/attempt/${attemptToken}/answers`, {
    method: 'PUT',
    body: JSON.stringify({
      answers,
    }),
  });
}

// ======================================================
// RESUME ATTEMPT
// GET /tryout/attempt/{attempt_token}/resume
// ======================================================

export async function resumeAttempt(attemptToken) {
  return request(`/tryout/attempt/${attemptToken}/resume`);
}

// ======================================================
// SUBMIT TRYOUT
// POST /tryout/attempt/{attempt_token}/submit
// ======================================================

export async function submitAttempt(attemptToken) {
  return request(`/tryout/attempt/${attemptToken}/submit`, {
    method: 'POST',
  });
}
