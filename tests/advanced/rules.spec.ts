import { test, expect } from '@playwright/test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let testEnv: RulesTestEnvironment;

test.describe('Firebase Security Rules', () => {
  test.beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'velo-d3b31-test',
      firestore: {
        rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  test.afterAll(async () => {
    await testEnv.cleanup();
  });

  test.beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  test('Denies read/write access to unauthenticated users', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    
    // Attempt to read user profile
    await assertFails(unauthedDb.collection('users').doc('alice').get());
    
    // Attempt to read trades
    await assertFails(unauthedDb.collection('trades').doc('trade1').get());
  });

  test('Allows users to read and write their own profile safely', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();

    // Create profile (valid)
    await assertSucceeds(aliceDb.collection('users').doc('alice').set({
      isAdmin: false,
      demoBalance: 10000,
      realBalance: 0
    }));

    // Update profile safely
    await assertSucceeds(aliceDb.collection('users').doc('alice').update({
      tier: 'Silver'
    }));

    // Attempt privilege escalation (invalid)
    await assertFails(aliceDb.collection('users').doc('alice').update({
      isAdmin: true
    }));
  });

  test('Allows users to place a trade but prevents modifying other users trades', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const bobDb = testEnv.authenticatedContext('bob').firestore();

    // Alice places a valid trade
    await assertSucceeds(aliceDb.collection('trades').doc('trade1').set({
      userId: 'alice',
      status: 'open',
      amount: 50
    }));

    // Alice attempts to place trade with negative amount
    await assertFails(aliceDb.collection('trades').doc('trade2').set({
      userId: 'alice',
      status: 'open',
      amount: -10
    }));

    // Bob attempts to read Alice's trade
    await assertFails(bobDb.collection('trades').doc('trade1').get());

    // Bob attempts to modify Alice's trade
    await assertFails(bobDb.collection('trades').doc('trade1').update({
      status: 'closed'
    }));
  });

  test('Admin has full read/write access', async () => {
    // Setup Admin user
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('users').doc('adminUser').set({
        isAdmin: true
      });
    });

    const adminDb = testEnv.authenticatedContext('adminUser').firestore();

    // Admin reads Alice's trade
    await assertSucceeds(adminDb.collection('trades').doc('trade1').get());

    // Admin updates Alice's trade
    await assertSucceeds(adminDb.collection('trades').doc('trade1').set({
      userId: 'alice',
      status: 'closed'
    }));
  });
});
