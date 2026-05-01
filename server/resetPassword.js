/**
 * Password Reset Script
 * Resets the password for a specific user account.
 * Usage: node resetPassword.js <email> <newPassword>
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetPassword = async () => {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error('Usage: node resetPassword.js <email> <newPassword>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }

    // Set new password (will be hashed by pre-save hook)
    user.passwordHash = newPassword;
    await user.save();

    console.log(`✅ Password reset successfully for: ${user.username} (${user.email})`);
    console.log(`   New password: ${newPassword}`);
    
    // Verify the new password works
    const isMatch = await user.matchPassword(newPassword);
    console.log(`   Verification: ${isMatch ? '✅ Password matches' : '❌ Password does NOT match'}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetPassword();
