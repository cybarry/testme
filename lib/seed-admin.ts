// lib/seed-admin.ts
import { createAdminIfNotExists } from '@/lib/create-admin';

(async () => {
  await createAdminIfNotExists();
  console.log('Admin seeding completed');
  process.exit(0);
})();