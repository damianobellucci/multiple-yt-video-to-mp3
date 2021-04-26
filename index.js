var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const fs = require('fs');
const readline = require('readline');

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "./ffmpeg/ffmpeg.exe",        // FFmpeg binary location
    "outputPath": "./output/playlist",    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 5,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});



YD.on("error", function (error) {
    console.log(error);
});

YD.on("progress", function (progress) {
    //console.log(JSON.stringify(progress));
});

var lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt')
});


var list = []

lineReader.on('line', function (line) {
    //Download video and save as MP3 file

    let arraySongInfo = line.split('-').slice(1)

    let songInfo = {}

    for (el of arraySongInfo) {
        switch (el.charAt(0)) {
            case "l":
                songInfo.link = el.slice(2).trim()
                link = el.slice(2).trim().split("=").pop()
                break;
            case "t":
                songInfo.title = el.slice(2).trim()
                break;
            case "a":
                songInfo.producer = el.slice(2).trim()
                break;
            default:
                break;
        }
    }
    list.push(songInfo)
    YD.download(songInfo.link.split("=").pop(), songInfo.title + " prod. by " + songInfo.producer + ".mp3");
});

YD.on("finished", function (err, data) {
    fs.writeFile('./output/info.json', JSON.stringify({ 'list': list, "counter": list.length }), function (err) {
        if (err) return console.log(err);
    });
});