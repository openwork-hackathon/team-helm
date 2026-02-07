import { mintclub } from 'mint.club-v2-sdk';

async function checkToken() {
  try {
    const exists = await mintclub.network('base').token('HELM').exists();
    if (exists) {
      const detail = await mintclub.network('base').token('HELM').getDetail();
      console.log(`✅ HELM Token Address: ${detail.info.token}`);
      process.exit(0);
    } else {
      console.log('❌ Token not found yet.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error checking token:', error);
    process.exit(1);
  }
}

checkToken();
