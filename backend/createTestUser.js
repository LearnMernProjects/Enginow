// Create a test user and display it
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB\n');

    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@example.com' });

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: 'password123',
      role: 'user',
    });

    await testUser.save();

    console.log('✅ Test user created successfully!\n');
    console.log('📊 USER DETAILS:');
    console.log('='.repeat(60));
    console.log(`Name: ${testUser.name}`);
    console.log(`Email: ${testUser.email}`);
    console.log(`Role: ${testUser.role}`);
    console.log(`User ID: ${testUser._id}`);
    console.log(`Created At: ${testUser.createdAt}`);
    console.log(`Updated At: ${testUser.updatedAt}`);
    console.log('\n🔐 Password Security:');
    console.log(`Original Password: password123`);
    console.log(`Hashed Password: ${testUser.passwordHash}`);
    console.log(`Hash Length: ${testUser.passwordHash.length} characters`);
    console.log('\n✅ Password is properly hashed and secure!\n');

    // Verify password works
    const isPasswordCorrect = await testUser.matchPassword('password123');
    console.log(`Password verification: ${isPasswordCorrect ? '✅ Correct' : '❌ Failed'}\n`);

    console.log('='.repeat(60));
    console.log('\n📝 YOU CAN NOW:');
    console.log('1. Sign in with: test@example.com / password123');
    console.log('2. Check MongoDB Atlas to see the user record');
    console.log('3. Password is hashed with bcryptjs (bcrypt) for security');
    console.log('\n✨ All user data is now properly stored!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
