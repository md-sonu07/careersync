async function testLearningFlow() {
  const baseURL = 'http://127.0.0.1:8000/api';
  console.log('--- TESTING PHASE 9 LEARNING RECOMMENDATIONS API ENDPOINTS ---\n');

  // 1. GET /api/courses/resources/
  try {
    const res = await fetch(`${baseURL}/courses/resources/`);
    const list = await res.json();
    console.log(`[1/4] GET /api/courses/resources/ success: ${list.length} learning resources available.`);
    if (list.length > 0) {
      console.log(`      Sample Resource: ${list[0].title} [Skill: ${list[0].skill?.name}]`);
    }
  } catch (err) {
    console.error('[1/4] Failed to fetch learning resources:', err.message);
  }

  // 2. Login student
  let token = null;
  try {
    const loginRes = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@skillbridge.ai', password: 'Password123!' }),
    });
    const loginData = await loginRes.json();
    token = loginData.access;
    console.log(`[2/4] Student login success for: ${loginData.user.email}`);
  } catch (err) {
    console.error('[2/4] Student login failed:', err.message);
  }

  // 3. GET /api/courses/recommendations/ (Personalized engine output)
  let recId = null;
  if (token) {
    try {
      const recRes = await fetch(`${baseURL}/courses/recommendations/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const recs = await recRes.json();
      console.log(`[3/4] GET /api/courses/recommendations/ success: ${recs.length} personalized recommendations generated.`);
      if (recs.length > 0) {
        recId = recs[0].id;
        console.log(`      Top Recommendation: ${recs[0].resource?.title} [Priority: ${recs[0].priority}]`);
        console.log(`      Reason: ${recs[0].recommended_reason}`);
      }
    } catch (err) {
      console.error('[3/4] Fetch recommendations failed:', err.message);
    }
  }

  // 4. PATCH /api/courses/recommendations/{id}/ (Update status to in_progress)
  if (token && recId) {
    try {
      const patchRes = await fetch(`${baseURL}/courses/recommendations/${recId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'in_progress' }),
      });
      const updated = await patchRes.json();
      console.log(`[4/4] PATCH /api/courses/recommendations/{id}/ success: Status updated to "${updated.status}" ✓`);
    } catch (err) {
      console.error('[4/4] Update recommendation status failed:', err.message);
    }
  }

  console.log('\n--- PHASE 9 LEARNING RECOMMENDATIONS VERIFICATION COMPLETE ---');
}

testLearningFlow();
