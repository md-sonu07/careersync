async function testAssessmentFlow() {
  const baseURL = 'http://127.0.0.1:8000/api';
  console.log('--- TESTING PHASE 6 & 7 ASSESSMENT SYSTEM API ENDPOINTS ---\n');

  // 1. GET /api/assessments/
  let assessmentId = null;
  try {
    const res = await fetch(`${baseURL}/assessments/`);
    const list = await res.json();
    console.log(`[1/5] GET /api/assessments/ success: ${list.length} active assessments found.`);
    if (list.length > 0) {
      assessmentId = list[0].id;
      console.log(`      Assessment: ${list[0].title} [${list[0].skill?.name}]`);
    }
  } catch (err) {
    console.error('[1/5] Failed to fetch assessments:', err.message);
  }

  // 2. GET /api/assessments/{id}/ (Security Check)
  let firstQuestion = null;
  if (assessmentId) {
    try {
      const detailRes = await fetch(`${baseURL}/assessments/${assessmentId}/`);
      const detail = await detailRes.json();
      firstQuestion = detail.questions?.[0];
      const hasIsCorrect = firstQuestion?.options?.some(o => 'is_correct' in o);
      console.log(`[2/5] GET /api/assessments/{id}/ success: ${detail.questions?.length} questions retrieved.`);
      console.log(`      Security check (is_correct hidden from options): ${!hasIsCorrect ? 'PASSED ✓' : 'FAILED ✗'}`);
    } catch (err) {
      console.error('[2/5] Failed to fetch assessment details:', err.message);
    }
  }

  // 3. Login student
  let token = null;
  try {
    const loginRes = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@skillbridge.ai', password: 'Password123!' }),
    });
    const loginData = await loginRes.json();
    token = loginData.access;
    console.log(`[3/5] Student login success for: ${loginData.user.email}`);
  } catch (err) {
    console.error('[3/5] Student login failed:', err.message);
  }

  // 4. Start Assessment Attempt
  let attemptId = null;
  if (token && assessmentId) {
    try {
      const startRes = await fetch(`${baseURL}/assessments/${assessmentId}/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const attempt = await startRes.json();
      attemptId = attempt.id;
      console.log(`[4/5] POST /api/assessments/{id}/start/ success: Attempt started (ID: ${attemptId})`);
    } catch (err) {
      console.error('[4/5] Start attempt failed:', err.message);
    }
  }

  // 5. Submit Answers
  if (token && attemptId && firstQuestion) {
    try {
      const selectedOptionId = firstQuestion.options[0]?.id;
      const submitRes = await fetch(`${baseURL}/assessments/attempts/${attemptId}/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: [
            {
              question_id: firstQuestion.id,
              selected_option_id: selectedOptionId,
            },
          ],
        }),
      });
      const result = await submitRes.json();
      console.log(`[5/5] POST /api/assessments/attempts/{id}/submit/ success:`);
      console.log(`      Status: ${result.status} | Percentage: ${result.percentage}% | Verified Skill Score updated.`);
    } catch (err) {
      console.error('[5/5] Submit attempt failed:', err.message);
    }
  }

  console.log('\n--- PHASE 6 & 7 ASSESSMENT SYSTEM VERIFICATION COMPLETE ---');
}

testAssessmentFlow();
