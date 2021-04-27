var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const fs = require('fs');
const readline = require('readline');

var ffmetadata = require("ffmetadata");

ffmetadata.setFfmpegPath("./ffmpeg/ffmpeg.exe");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "./ffmpeg/ffmpeg.exe",        // FFmpeg binary location
    "outputPath": "./output/playlist",    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 100,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});



YD.on("error", function (error) {
    //console.log(error);
});

YD.on("progress", function (progress) {
    //console.log(JSON.stringify(progress));
});

var lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt')
});


var list = []

function callBackLine(line, cb) {
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

    let songString = songInfo.title + " prod. by " + songInfo.producer + ".mp3";

    //wrappare yd.download in promise, quando ha finito sono sicuro che c'è la traccia in playlist ed ho il titolo, con cui vado a prenderle la traccia per modificare i metadati
    let songMetadata = {
        artist: songInfo.producer,
        title: songInfo.title
    };

    let promiseDownload = new Promise((res, rej) => {
        YD.download(songInfo.link.split("=").pop(), songInfo.title + " prod. by " + songInfo.producer + ".mp3");
        setTimeout(() => res(), 15000, 'funky');
    })
    Promise.resolve(promiseDownload);
    setTimeout(() => { cb(songString, songMetadata) }, 10000, 'funky');

}

lineReader.on('line', async function (line) {
    callBackLine(line, (songString, songMetadata) => {
        setTimeout(() => ffmetadata.write("output/playlist/" + songString, songMetadata, function (err) {
            if (err) console.error("Error writing metadata", err);
            else console.log("Data written");
        }), 15000, 'funky');

    })

});


YD.on("finished", function (err, data) {
    console.log(data)
    fs.writeFile('./output/info.json', JSON.stringify({ 'list': list, "counter": list.length }), function (err) {
        if (err) return console.log(err);
    });
});


/*

let songMetadata = {
    artist: "Sedivi",
    title: "No time"
};
ffmetadata.write("output/playlist/No time prod. by Sedivi.mp3", songMetadata, function (err) {
    if (err) console.error("Error writing metadata", err);
    else console.log("Data written");
});
*/