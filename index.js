var YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "./ffmpeg/ffmpeg.exe",        // FFmpeg binary location
    "outputPath": "./output",    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 20,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});

YD.on("finished", function (err, data) {
    //console.log(JSON.stringify(data));
});

YD.on("error", function (error) {
    console.log(error);
});

YD.on("progress", function (progress) {
    //console.log(JSON.stringify(progress));
});

const fs = require('fs');
const readline = require('readline');

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./input.txt')
});

lineReader.on('line', function (line) {
    //Download video and save as MP3 file
    YD.download(line.split('=').pop());
});