// View all users in the database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function viewUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB\n');

    // Fetch all users
    const users = await User.find().select('-passwordHash'); // Hide passwords
    
    console.log('📊 USERS IN DATABASE:');
    console.log('='.repeat(80));
    
    if (users.length === 0) {
      console.log('No users found');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Updated: ${user.updatedAt}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log(`Total users: ${users.length}`);
    
    // Also show with passwords (hashed)
    console.log('\n\n📊 FULL USER DATA (with password hashes):');
    console.log('='.repeat(80));
    
    const usersWithPassword = await User.find();
    usersWithPassword.forEach((user, index) => {
      console.log(`\n${index + 1}. User`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password Hash: ${user.passwordHash ? user.passwordHash.substring(0, 20) + '...' : 'Not set'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

viewUsers();
