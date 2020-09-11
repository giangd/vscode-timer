const cp = require("child_process");
const path = require("path");
const player = require("play-sound")();

const _isWindows = process.platform === "win32";
const _playerWindowsPath = path.join(__dirname, "..", "sounds", "sounder.exe");

const soundSettings = {
    macVol: 1,
    winVol: 100,
    linuxVol: 100,
};

const playerAdapter = (opts) => ({
    afplay: ["-v", opts.macVol],
    mplayer: ["-af", `volume=${opts.linuxVol}`],
});

const play = (filePath, soundSettings) => {
    // console.log("player.play()");
    return new Promise((resolve, reject) => {
        // console.log("   player.play() 1");

        if (_isWindows) {
            // console.log("   player.play() 2");
            // console.log(`will try to use: ${_playerWindowsPath}`);
            // console.log(`with settings: ${soundSettings.winVol}`);
            // console.log(`to play: ${filePath}`);

            cp.execFile(_playerWindowsPath, [
                "/vol",
                soundSettings.winVol,
                filePath,
            ]);
            resolve();
        } else {
            // console.log("   player.play() 3");

            player.play(filePath, playerAdapter(soundSettings), (err) => {
                if (err) {
                    console.error(
                        "Error playing sound:",
                        filePath,
                        " - Description:",
                        err
                    );
                    return reject(err);
                }
                resolve();
            });
        }
        // console.log("   player.play() 4");
    });
};

module.exports = {
    soundSettings,
    play,
};
