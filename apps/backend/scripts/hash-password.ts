// scripts/hash-password.ts (keeping for future resets)
import bcrypt from 'bcrypt';

const password = process.argv[2];
if (!password) {
  console.error('Usage: tsx scripts/hash-password.ts <your-password>');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('Add this to your .env as ADMIN_PASSWORD_HASH:');
  console.log(hash);
});