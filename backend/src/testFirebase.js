import { db } from './firebase/firebaseAdmin.js';

async function test() {
  await db.collection('test').doc('connection').set({
    status: 'connected',
    timestamp: new Date(),
  });

  console.log('✅ Firebase Connected');
}

test();