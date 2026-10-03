import { initDatabase, getStoredSiteContent, updateStoredSiteContent, db } from '../db/database';
import {
  isDatabaseInitialized,
  initializeAdminToken,
  verifyAdminToken,
  createSession,
  validateSession,
  destroySession,
} from '../auth/authService';

async function runVerification() {
  console.log('🎸 === STARTING DEATHROLL SYSTEM VERIFICATION ===\n');

  // Test 1: Database and Seeding
  initDatabase();
  const initialContent = getStoredSiteContent();
  console.log(`✓ 1. SQLite Database initialized. Band: "${initialContent.content.site.bandName}", Revision: ${initialContent.revision}`);
  if (initialContent.content.site.bandName !== 'DEATHROLL') {
    throw new Error('Initial band name should be DEATHROLL');
  }

  // Test 2: Admin Initialization State
  // Clear any previous credentials for testing
  db.prepare('DELETE FROM admin_credentials').run();
  db.prepare('DELETE FROM admin_sessions').run();

  const initCheck1 = isDatabaseInitialized();
  console.log(`✓ 2. Fresh database initialized check: ${initCheck1} (Expected: false)`);
  if (initCheck1 !== false) throw new Error('Expected uninitialized');

  // Test 3: Initialize Master Admin
  const secretToken = 'deathroll_punk_2026';
  const initSuccess = initializeAdminToken(secretToken);
  console.log(`✓ 3. Admin initialization with secret token: ${initSuccess}`);
  if (!initSuccess) throw new Error('Failed to initialize admin');

  const secondInit = initializeAdminToken('another_token');
  console.log(`✓ 4. Second initialization blocked: ${!secondInit} (One-time only enforced)`);
  if (secondInit !== false) throw new Error('Second init should fail');

  // Test 4: Token Verification
  const validCheck = verifyAdminToken(secretToken);
  const invalidCheck = verifyAdminToken('wrong_password');
  console.log(`✓ 5. Token validation: Valid Token => ${validCheck}, Invalid Token => ${invalidCheck}`);
  if (!validCheck || invalidCheck) throw new Error('Token verification mismatch');

  // Test 5: Session Creation & Expiry
  const session = createSession();
  const sessionValid = validateSession(session.sessionId);
  console.log(`✓ 6. Session created and validated: ${sessionValid}`);
  if (!sessionValid) throw new Error('Session should be valid');

  // Test 6: Content Atomic Mutation with Revision Tracking
  const updatedDoc = { ...initialContent.content, site: { ...initialContent.content.site, tagline: 'TEST UPDATED TAGLINE' } };
  const saveRes = updateStoredSiteContent(updatedDoc, 1);
  console.log(`✓ 7. Site Content updated. Next Revision: ${saveRes.revision}`);
  if (saveRes.revision !== 2) throw new Error('Revision should increment to 2');

  // Test 7: Revision Conflict (409)
  let conflictCaught = false;
  try {
    updateStoredSiteContent(updatedDoc, 1); // stale revision
  } catch (err: any) {
    if (err.message === 'REVISION_CONFLICT') {
      conflictCaught = true;
    }
  }
  console.log(`✓ 8. Revision conflict prevention (Stale revision 1 rejected): ${conflictCaught}`);
  if (!conflictCaught) throw new Error('Stale revision should have been rejected');

  // Test 8: Logout / Session Destruction
  destroySession(session.sessionId);
  const sessionAfterLogout = validateSession(session.sessionId);
  console.log(`✓ 9. Session destroyed on logout: ${!sessionAfterLogout}`);
  if (sessionAfterLogout) throw new Error('Session should be invalid after destroy');

  // Cleanup & Restore clean state
  db.prepare('DELETE FROM admin_credentials').run();
  db.prepare('DELETE FROM admin_sessions').run();
  // Reset content to revision 1
  const now = Date.now();
  db.prepare('UPDATE site_content SET revision = 1, updated_at = ? WHERE id = 1').run(now);

  console.log('\n🔥 ALL TECHNICAL SPEC CHECKS PASSED PERFECTLY!');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
