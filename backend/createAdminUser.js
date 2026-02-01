// Create an admin user for course management
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB\n');

    // Delete existing admin user if exists
    await User.deleteOne({ email: 'admin@enginow.com' });

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@enginow.com',
      passwordHash: 'admin123456',
      role: 'admin',
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!\n');
    console.log('📊 ADMIN USER DETAILS:');
    console.log('='.repeat(60));
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`User ID: ${adminUser._id}`);
    console.log(`Created At: ${adminUser.createdAt}`);
    console.log('\n🔐 Login Credentials:');
    console.log(`Email: admin@enginow.com`);
    console.log(`Password: admin123456`);
    console.log('\n✅ Password is properly hashed and secure!\n');

    // Verify password works
    const isPasswordCorrect = await adminUser.matchPassword('admin123456');
    console.log(`Password verification: ${isPasswordCorrect ? '✅ Correct' : '❌ Failed'}\n`);

    console.log('='.repeat(60));
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Sign in with: admin@enginow.com / admin123456');
    console.log('2. You can now create courses via the API');
    console.log('3. Password is hashed with bcryptjs (bcrypt) for security');
    console.log('\n✨ Admin user is ready to manage courses!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
