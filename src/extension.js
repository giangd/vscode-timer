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
    // timer.createStatusBarClock();

    const startTimerCmd = vscode.commands.registerCommand("timer.start", () => {
        vscode.window.showInformationMessage("Timer Started");
        timer.start();
    });

    const pauseTimerCmd = vscode.commands.registerCommand("timer.pause", () => {
        vscode.window.showInformationMessage("Timer Paused");
        timer.pause();
    });

    const resetTimerCmd = vscode.commands.registerCommand("timer.reset", () => {
        vscode.window.showInformationMessage("Timer Reset");
        timer.reset();
    });

    const playSoundCmd = vscode.commands.registerCommand(
        "timer.playSound",
        () => {
            vscode.window.showInformationMessage("Playing Sound");
            player.play(soundFilePath, player.soundSettings).then(() => {
                console.log("sound has played");
            });
        }
    );

    disposable.push(timer, startTimerCmd, playSoundCmd, resetTimerCmd);
    for (const item of disposable) {
        context.subscriptions.push(item);
    }
}

function Timer() {
    const state = {
        isPlaying: false,
        isPaused: false,
        isStopped: false,
        isInProgress: false,
    };

    const statusBar = {
        text: undefined,
        playButton: undefined,
        pauseButton: undefined,
        resetButton: undefined,
    };

    const time = {
        startingLength: 8,
        remainingLength: undefined,
        intervalObject: undefined,
    };

    this.start = () => {
        if (!state.isInProgress) {
            state.isInProgress = true;
            state.isPlaying = true;

            time.intervalObject = setInterval(tick, 1000);
        } else if (state.isInProgress && state.isPaused) {
            state.isPaused = false;
            state.isPlaying = true;
        } else {
            console.error("timer has already started");
        }
        updateStatusBarIcons();
    };

    this.pause = () => {
        state.isPaused = true;
        state.isPlaying = false;
        updateStatusBarIcons();
    };

    const tick = () => {
        statusBar.text.show();
        if (time.remainingLength <= 0) {
            state.isPlaying = false;
            state.isStopped = true;
            this.stop();
        } else if (state.isPlaying) {
            time.remainingLength -= 1;
            state.isPlaying = true;

            updateStatusBarIcons();
        } else {
            console.log(
                `paused remainingSecs: ${time.remainingLength} min: ${minutes} sec: ${seconds}`
            );
        }
    };

    this.stop = () => {
        state.isInProgress = false;
        state.isStopped = true;
        clearInterval(time.intervalObject);
        time.remainingLength = 0;
        playAlarm();
        updateStatusBarIcons();
    };

    this.reset = () => {
        console.log("timer reset");
        state.isPlaying = false;
        state.isPaused = false;
        state.isStopped = false;
        state.isInProgress = false;
        this.start();
        updateStatusBarIcons();
    };

    const updateStatusBarIcons = () => {
        if (state.isStopped) {
            statusBar.resetButton.show();
            statusBar.pauseButton.hide();
            statusBar.playButton.hide();
        } else if (state.isPaused) {
            statusBar.resetButton.hide();
            statusBar.pauseButton.hide();
            statusBar.playButton.show();
        } else if (state.isPlaying) {
            statusBar.resetButton.hide();
            statusBar.pauseButton.show();
            statusBar.playButton.hide();
        }

        let seconds = time.remainingLength % 60;
        let minutes = (time.remainingLength - seconds) / 60;
        statusBar.text.text = `${minutes < 10 ? `0${minutes}` : minutes}:${
            seconds < 10 ? `0${seconds}` : seconds
        }`;
    };

    const createStatusBarIcons = () => {
        statusBar.text = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );

        statusBar.playButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );
        statusBar.playButton.text = `$(debug-start)`;
        statusBar.playButton.command = "timer.start";
        statusBar.playButton.tooltip = "Start";

        statusBar.pauseButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );
        statusBar.pauseButton.text = "$(debug-pause)";
        statusBar.pauseButton.command = "timer.pause";
        statusBar.pauseButton.tooltip = "Pause";

        statusBar.resetButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );
        statusBar.resetButton.text = "$(debug-restart)";
        statusBar.resetButton.command = "timer.reset";
        statusBar.resetButton.tooltip = "Reset";

        statusBar.text.show();

        time.remainingLength = time.startingLength;
        updateStatusBarIcons();
    };
    createStatusBarIcons();

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
