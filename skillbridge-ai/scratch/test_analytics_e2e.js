async function testAnalyticsFlow() {
  const baseURL = 'http://127.0.0.1:8000/api';
  console.log('--- TESTING PHASE 13 ANALYTICS API ENDPOINTS ---\n');

  // 1. Student Analytics
  try {
    const studentLogin = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@skillbridge.ai', password: 'Password123!' }),
    });
    const sData = await studentLogin.json();
    const resS = await fetch(`${baseURL}/analytics/student/`, {
      headers: { 'Authorization': `Bearer ${sData.access}` },
    });
    const analyticsS = await resS.json();
    console.log('[1/3] GET /api/analytics/student/ success:');
    console.log(`      Career Readiness: ${analyticsS.career_readiness?.score_percentage}%`);
    console.log(`      Verified Skills: ${analyticsS.career_readiness?.verified_skills_count} / ${analyticsS.career_readiness?.total_skills_count}`);
    console.log(`      Top Skill Gaps: ${analyticsS.top_skill_gaps?.length} active gaps`);
  } catch (err) {
    console.error('[1/3] Student analytics failed:', err.message);
  }

  // 2. Company Analytics
  try {
    const companyLogin = await fetch(`${baseURL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hr@flipkart.com', password: 'Password123!' }),
    });
    const cData = await companyLogin.json();
    const resC = await fetch(`${baseURL}/analytics/company/`, {
      headers: { 'Authorization': `Bearer ${cData.access}` },
    });
    const analyticsC = await resC.json();
    console.log('\n[2/3] GET /api/analytics/company/ success:');
    console.log(`      Active Opportunities: ${analyticsC.active_opportunities}`);
    console.log(`      Total Applications Received: ${analyticsC.total_applications}`);
    console.log(`      Shortlisted Candidates: ${analyticsC.shortlisted_candidates}`);
  } catch (err) {
    console.error('[2/3] Company analytics failed:', err.message);
  }

  console.log('\n--- PHASE 13 ANALYTICS VERIFICATION COMPLETE ---');
}

testAnalyticsFlow();
