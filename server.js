const path = require('path');


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/referralPortal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Schemas
const jobSchema = new mongoose.Schema({
    title: String,
});

const leaderboardSchema = new mongoose.Schema({
    name: String,
    referrals: Number,
});

const rewardSchema = new mongoose.Schema({
    description: String,
});

const faqSchema = new mongoose.Schema({
    question: String,
    answer: String,
});

const referralSchema = new mongoose.Schema({
    candidateName: String,
    candidateEmail: String,
    jobId: mongoose.Schema.Types.ObjectId,
});

const Job = mongoose.model('Job', jobSchema);
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
const Reward = mongoose.model('Reward', rewardSchema);
const FAQ = mongoose.model('FAQ', faqSchema);
const Referral = mongoose.model('Referral', referralSchema);

// API Endpoints
app.get('/api/dashboard', (req, res) => {
    const data = {
        hiresThisMonth: 10,
        conversionRate: 25,
        referralStatus: {
            labels: ['Pending', 'Reviewed', 'Interviewing', 'Hired'],
            data: [20, 15, 10, 5],
        },
        referralsOverTime: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            data: [5, 8, 12, 15, 20],
        },
    };
    res.json(data);
});

app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find().sort({ referrals: -1 });
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/rewards', async (req, res) => {
    try {
        const rewards = await Reward.find();
        res.json(rewards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/faq', async (req, res) => {
    try {
        const faq = await FAQ.find();
        res.json(faq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/referrals', async (req, res) => {
    const referral = new Referral({
        candidateName: req.body.candidateName,
        candidateEmail: req.body.candidateEmail,
        jobId: req.body.jobId,
    });
    try {
        const newReferral = await referral.save();
        res.status(201).json(newReferral);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

