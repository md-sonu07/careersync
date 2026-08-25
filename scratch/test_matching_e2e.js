async function testMatchingFlow() {
  const baseURL = 'http://127.0.0.1:8000/api';
  console.log('--- TESTING PHASE 11 OPPORTUNITY MATCHING ENGINE API ENDPOINTS ---\n');

  // 1. Login Student
  let token = null;
  try {
    const loginRes = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@skillbridge.ai', password: 'Password123!' }),
    });
    const loginData = await loginRes.json();
    token = loginData.access;
    console.log(`[1/2] Student login success for: ${loginData.user.email}`);
  } catch (err) {
    console.error('[1/2] Student login failed:', err.message);
  }

  // 2. GET /api/opportunities/matches/
  if (token) {
    try {
      const matchRes = await fetch(`${baseURL}/opportunities/matches/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const matches = await matchRes.json();
      console.log(`[2/2] GET /api/opportunities/matches/ success: ${matches.length} matches calculated.`);
      matches.forEach((m, idx) => {
        console.log(`      [Match #${idx + 1}] ${m.opportunity?.title} @ ${m.opportunity?.company?.company_name} => ${m.match_score}% Match Score`);
      });
    } catch (err) {
      console.error('[2/2] Fetch matches failed:', err.message);
    }
  }

  console.log('\n--- PHASE 11 OPPORTUNITY MATCHING ENGINE VERIFICATION COMPLETE ---');
}

testMatchingFlow();
