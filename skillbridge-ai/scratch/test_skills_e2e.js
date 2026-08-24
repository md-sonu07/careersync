async function testSkillsAPI() {
  const baseURL = 'http://127.0.0.1:8000/api';
  console.log('--- TESTING PHASE 4 & 5 SKILLS API ENDPOINTS ---\n');

  // 1. GET /api/skills/
  try {
    const res = await fetch(`${baseURL}/skills/`);
    const skills = await res.json();
    console.log(`[1/5] GET /api/skills/ success: ${skills.length} skills found in library.`);
    if (skills.length > 0) {
      console.log(`      Sample Skill: ${skills[0].name} [${skills[0].category}]`);
    }
  } catch (err) {
    console.error('[1/5] Failed to fetch skills:', err.message);
  }

  // 2. GET /api/skills/career-roles/
  try {
    const res = await fetch(`${baseURL}/skills/career-roles/`);
    const roles = await res.json();
    console.log(`[2/5] GET /api/skills/career-roles/ success: ${roles.length} career roles found.`);
    if (roles.length > 0) {
      console.log(`      Sample Role: ${roles[0].title} with ${roles[0].skill_requirements?.length} required skills.`);
    }
  } catch (err) {
    console.error('[2/5] Failed to fetch career roles:', err.message);
  }

  // 3. Login as student
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
    console.error('[3/5] Login failed:', err.message);
  }

  // 4. Add skill to Student Profile
  if (token) {
    try {
      // Get python skill ID
      const skillsRes = await fetch(`${baseURL}/skills/?search=Python`);
      const skills = await skillsRes.json();
      const pythonSkill = skills[0];

      if (pythonSkill) {
        const addRes = await fetch(`${baseURL}/students/my-skills/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            skill_id: pythonSkill.id,
            score: 85,
            level: 'Advanced',
            source: 'manual',
          }),
        });
        const addData = await addRes.json();
        console.log(`[4/5] POST /api/students/my-skills/ success: Added ${addData.skill?.name || 'Python'} (Score: ${addData.score}%)`);
      }
    } catch (err) {
      console.error('[4/5] Add student skill failed:', err.message);
    }

    // 5. GET Student Skills
    try {
      const getRes = await fetch(`${baseURL}/students/my-skills/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const mySkills = await getRes.json();
      console.log(`[5/5] GET /api/students/my-skills/ success: Student has ${mySkills.length} assigned skill(s).`);
    } catch (err) {
      console.error('[5/5] Get student skills failed:', err.message);
    }
  }

  console.log('\n--- PHASE 4 & 5 VERIFICATION COMPLETE ---');
}

testSkillsAPI();
