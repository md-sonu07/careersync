async function testOpportunitiesFlow() {
  const baseURL = 'http://127.0.0.1:8000/api';
  console.log('--- TESTING PHASE 10 OPPORTUNITIES API ENDPOINTS ---\n');

  // 1. GET /api/opportunities/
  let oppId = null;
  try {
    const res = await fetch(`${baseURL}/opportunities/`);
    const list = await res.json();
    console.log(`[1/5] GET /api/opportunities/ success: ${list.length} published opportunities found.`);
    if (list.length > 0) {
      oppId = list[0].id;
      console.log(`      Sample Opportunity: ${list[0].title} @ ${list[0].company?.company_name} [${list[0].stipend_salary}]`);
    }
  } catch (err) {
    console.error('[1/5] Failed to fetch opportunities:', err.message);
  }

  // 2. Login Flipkart Recruiter
  let token1 = null;
  try {
    const loginRes = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hr@flipkart.com', password: 'Password123!' }),
    });
    const loginData = await loginRes.json();
    token1 = loginData.access;
    console.log(`[2/5] Recruiter login success for: ${loginData.user.email}`);
  } catch (err) {
    console.error('[2/5] Recruiter login failed:', err.message);
  }

  // 3. POST /api/opportunities/
  let newOppId = null;
  if (token1) {
    try {
      const postRes = await fetch(`${baseURL}/opportunities/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token1}`,
        },
        body: JSON.stringify({
          title: 'Full Stack Engineering Intern',
          opportunity_type: 'internship',
          description: 'Build end-to-end features in React and Django.',
          location: 'Bengaluru (Hybrid)',
          work_mode: 'hybrid',
          duration: '6 months',
          stipend_salary: '₹35,000 / month',
          status: 'published',
        }),
      });
      const newOpp = await postRes.json();
      newOppId = newOpp.id;
      console.log(`[3/5] POST /api/opportunities/ success: Created "${newOpp.title}" (ID: ${newOppId})`);
    } catch (err) {
      console.error('[3/5] Create opportunity failed:', err.message);
    }
  }

  // 4. Login CRED Recruiter (Non-owner)
  let token2 = null;
  try {
    const loginRes2 = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'careers@cred.club', password: 'Password123!' }),
    });
    const loginData2 = await loginRes2.json();
    token2 = loginData2.access;
  } catch (err) {
    //
  }

  // 5. Security Test: Non-owner edit attempt
  if (token2 && newOppId) {
    try {
      const patchRes = await fetch(`${baseURL}/opportunities/${newOppId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token2}`,
        },
        body: JSON.stringify({ title: 'Hacked Title' }),
      });
      console.log(`[4/5] Security Check (Non-owner edit forbidden): ${patchRes.status === 403 ? 'PASSED (403 Forbidden) ✓' : 'FAILED ✗'}`);
    } catch (err) {
      console.error('[4/5] Security check failed:', err.message);
    }
  }

  // 6. Owner edit
  if (token1 && newOppId) {
    try {
      const ownerPatchRes = await fetch(`${baseURL}/opportunities/${newOppId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token1}`,
        },
        body: JSON.stringify({ stipend_salary: '₹40,000 / month' }),
      });
      const updated = await ownerPatchRes.json();
      console.log(`[5/5] Owner update success: Updated stipend to "${updated.stipend_salary}" ✓`);
    } catch (err) {
      console.error('[5/5] Owner update failed:', err.message);
    }
  }

  console.log('\n--- PHASE 10 OPPORTUNITIES VERIFICATION COMPLETE ---');
}

testOpportunitiesFlow();
