import mongoose from 'mongoose';
import Case from './models/Case.js';
import dotenv from 'dotenv';

dotenv.config();

async function createPendingCases() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/legal-docs');
    console.log('✅ Connected\n');
    
    // Find first 50 completed cases
    const completedCases = await Case.find({ status: 'completed' }).limit(20);
    
    console.log(`Found ${completedCases.length} completed cases`);
    console.log('Converting to pending status...\n');
    
    let count = 0;
    for (const case_ of completedCases) {
      case_.status = 'pending';
      case_.scheduledDate = null;
      case_.scheduledTime = null;
      case_.courtRoom = null;
      await case_.save();
      count++;
      if (count % 10 === 0) {
        console.log(`✓ Updated ${count} cases...`);
      }
    }
    
    console.log(`\n✅ Successfully converted ${count} cases to pending status`);
    console.log('These cases can now be scheduled!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createPendingCases();
