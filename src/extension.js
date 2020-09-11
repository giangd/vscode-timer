const vscode = require("vscode");
const player = require("./player");
const path = require("path");

const basePath = path.join(__dirname, "..");
const soundFilePath = path.join(basePath, "sounds", "chime.wav");

function activate(context) {
    let disposable = [];
    console.log('Congratulations, your extension "timer" is now active!');
    console.log(`dir: ${basePath}`);

    const timer = new Timer();
    disposable.push(timer);

    disposable.push(
        vscode.commands.registerCommand("timer.startTimer", function () {
            vscode.window.showInformationMessage("Timer Started");
            timer.start();
        })
    );

    disposable.push(
        vscode.commands.registerCommand("timer.playSound", function () {
            vscode.window.showInformationMessage("Playing Sound");
            player.play(soundFilePath, player.soundSettings).then(() => {
                console.log("sound has played");
            });
        })
    );

    for (const item of disposable) {
        context.subscriptions.push(item);
    }
}

function Timer() {
    let isTicking = false;
    let hasStarted = false;
    let length = 10;
    let intervalObj;
    this.remainingSeconds = length;

    this.start = () => {
        if (!hasStarted) {
            hasStarted = true;
            intervalObj = setInterval(() => {
                this.remainingSeconds -= 1;
                if (this.remainingSeconds <= 0) {
                    this.stop();
                }
                console.log(`tick numSeconds: ${this.remainingSeconds}`);
            }, 1000);
        } else {
            console.error("timer has already started");
        }
    };

    this.stop = () => {
        clearInterval(intervalObj);
        this.remainingSeconds = 0;
        playAlarm();
        // console.log("timer stopped");
    };

    const playAlarm = () => {
        player.play(soundFilePath, player.soundSettings).then(() => {
            // console.log("alarm has played");
        });
    };
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
