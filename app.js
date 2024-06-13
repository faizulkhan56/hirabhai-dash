const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit')

const app = express();
const port = 3007;

// Enable CORS for all routes
app.use(cors());

const videoRateLimitSegments = rateLimit({
    windowMs: 10 * 1000, // 10 second
    max: 5, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});


app.use(express.static(path.join(__dirname, 'public')));
// Serve the DASH manifest file
app.get('/video.mpd', (req, res) => {
    console.log("called for mpd");
    const filePath = path.join(__dirname, 'video', 'video.mpd');
    res.sendFile(filePath);
});

// Serve the DASH segment files
app.get('/video/:segment', videoRateLimitSegments, (req, res) => {
    console.log("called segment");
    const segment = req.params.segment;
    const filePath = path.join(__dirname, 'video', segment);
    res.sendFile(filePath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
