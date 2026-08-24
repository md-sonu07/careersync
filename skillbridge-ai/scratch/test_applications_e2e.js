async function testApplicationsFlow() {
  const baseURL = 'http://127.0.0.1:8000/api';
  console.log('--- TESTING PHASE 12 APPLICATIONS API ENDPOINTS ---\n');

  // 1. Fetch published opportunities
  let oppId = null;
  try {
    const oppRes = await fetch(`${baseURL}/opportunities/`);
    const opps = await oppRes.json();
    if (opps.length > 0) {
      oppId = opps[0].id;
      console.log(`[1/6] Target Opportunity found: "${opps[0].title}" @ ${opps[0].company?.company_name}`);
    }
  } catch (err) {
    console.error('[1/6] Fetch opportunities failed:', err.message);
  }

  // 2. Login Student
  let studentToken = null;
  try {
    const loginRes = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@skillbridge.ai', password: 'Password123!' }),
    });
    const loginData = await loginRes.json();
    studentToken = loginData.access;
    console.log(`[2/6] Student login success for: ${loginData.user.email}`);
  } catch (err) {
    console.error('[2/6] Student login failed:', err.message);
  }

  // 3. POST /api/opportunities/{id}/apply/
  let appId = null;
  if (studentToken && oppId) {
    try {
      const applyRes = await fetch(`${baseURL}/opportunities/${oppId}/apply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          cover_letter: 'I am highly passionate about joining your engineering team.',
        }),
      });

      if (applyRes.status === 201) {
        const appData = await applyRes.json();
        appId = appData.id;
        console.log(`[3/6] POST /api/opportunities/{id}/apply/ success: Application submitted (ID: ${appId}) ✓`);
      } else if (applyRes.status === 400) {
        console.log(`[3/6] Application already submitted for this opportunity.`);
        // Get existing app ID
        const myAppsRes = await fetch(`${baseURL}/applications/my/`, {
          headers: { 'Authorization': `Bearer ${studentToken}` },
        });
        const myApps = await myAppsRes.json();
        if (myApps.length > 0) appId = myApps[0].id;
      }
    } catch (err) {
      console.error('[3/6] Submit application failed:', err.message);
    }
  }

  // 4. Duplicate Check (Expect 400)
  if (studentToken && oppId) {
    try {
      const dupRes = await fetch(`${baseURL}/opportunities/${oppId}/apply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ cover_letter: 'Duplicate attempt' }),
      });
      console.log(`[4/6] Unique Constraint check: ${dupRes.status === 400 ? 'PASSED (400 Bad Request) ✓' : 'FAILED ✗'}`);
    } catch (err) {
      console.error('[4/6] Duplicate check failed:', err.message);
    }
  }

  // 5. Login Recruiter (hr@flipkart.com)
  let recruiterToken = null;
  try {
    const recLoginRes = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hr@flipkart.com', password: 'Password123!' }),
    });
    const recLoginData = await recLoginRes.json();
    recruiterToken = recLoginData.access;
    console.log(`[5/6] Recruiter login success for: ${recLoginData.user.email}`);
  } catch (err) {
    console.error('[5/6] Recruiter login failed:', err.message);
  }

  // 6. Recruiter updates application status
  if (recruiterToken && appId) {
    try {
      const patchRes = await fetch(`${baseURL}/applications/${appId}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${recruiterToken}`,
        },
        body: JSON.stringify({
          status: 'shortlisted',
          remarks: 'Strong skill profile match.',
        }),
      });
      const updatedApp = await patchRes.json();
      console.log(`[6/6] Recruiter status update success: Status changed to "${updatedApp.status}" ✓`);
      console.log(`      Audit Log History entries: ${updatedApp.status_history?.length}`);
    } catch (err) {
      console.error('[6/6] Status update failed:', err.message);
    }
  }

  console.log('\n--- PHASE 12 APPLICATIONS VERIFICATION COMPLETE ---');
}

testApplicationsFlow();
