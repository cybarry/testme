// lib/createAdminIfNotExists.ts
import { connectDB } from '@/lib/db';
import { User } from '@/lib/schemas/user.schema';
import bcrypt from 'bcryptjs';

export async function createAdminIfNotExists() {
  try {
    await connectDB();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2025';
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@cbt.com';

    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD is missing in .env.local');
      return;
    }

    const existingAdmin = await User.findOne({
      $or: [{ username: ADMIN_USERNAME }, { email: ADMIN_EMAIL }, { role: 'admin' }]
    });

    if (existingAdmin) {
      // Admin already exists — do nothing
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = new User({
      username: ADMIN_USERNAME,
      password: hashedPassword,
      email: ADMIN_EMAIL,
      role: 'admin'
    });

    await admin.save();

    console.log('First admin user created successfully');
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('You can now log in as admin directly');
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }
}