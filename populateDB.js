const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/referralPortal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');

    const jobSchema = new mongoose.Schema({ title: String });
    const leaderboardSchema = new mongoose.Schema({ name: String, referrals: Number });
    const rewardSchema = new mongoose.Schema({ description: String });
    const faqSchema = new mongoose.Schema({ question: String, answer: String });

    const Job = mongoose.model('Job', jobSchema);
    const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
    const Reward = mongoose.model('Reward', rewardSchema);
    const FAQ = mongoose.model('FAQ', faqSchema);

    try {
        await Job.insertMany([{ title: 'Software Engineer' }, { title: 'Product Manager' }, { title: 'Data Scientist' }]);
        await Leaderboard.insertMany([{ name: 'Alice', referrals: 15 }, { name: 'Bob', referrals: 12 }, { name: 'Charlie', referrals: 10 }]);
        await Reward.insertMany([{ description: '$100 Gift Card' }, { description: 'Extra Vacation Day' }, { description: 'Company Swag' }]);
        await FAQ.insertMany([{ question: 'How do I submit a referral?', answer: 'Go to the referral section and fill out the form.' }, { question: 'What are the rewards?', answer: 'Check the rewards section for details.' }]);

        console.log('Database populated successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error populating database:', err);
        mongoose.connection.close();
    }
});