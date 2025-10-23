import mongoose from 'mongoose';
import Case from './models/Case.js';
import dotenv from 'dotenv';

dotenv.config();

async function revertSomeCases() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/legal-docs');
    console.log('✅ Connected\n');
    
    // Find first 50 pending cases (to convert back to completed)
    const pendingCases = await Case.find({ status: 'pending' }).limit(50);
    
    console.log(`Found ${pendingCases.length} pending cases`);
    console.log('Converting 50 back to completed status...\n');
    
    let count = 0;
    for (const case_ of pendingCases) {
      case_.status = 'completed';
      await case_.save();
      count++;
      if (count % 10 === 0) {
        console.log(`✓ Reverted ${count} cases...`);
      }
    }
    
    // Count final status
    const totalCases = await Case.countDocuments();
    const pendingCount = await Case.countDocuments({ status: 'pending' });
    const completedCount = await Case.countDocuments({ status: 'completed' });
    
    console.log(`\n✅ Successfully reverted ${count} cases to completed status`);
    console.log('\n📊 Final Status:');
    console.log(`   Total Cases: ${totalCases}`);
    console.log(`   Pending: ${pendingCount}`);
    console.log(`   Completed: ${completedCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

revertSomeCases();
