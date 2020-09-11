"use strict";

const vscode = require("vscode");
const player = require("./player");
const path = require("path");

const basePath = path.join(__dirname, ".."); // '/Projects'
const soundFilePath = path.join(basePath, "sounds", "chime.wav");

function activate(context) {
    let disposable = [];
    console.log('Congratulations, your extension "timer" is now active!');
    console.log(`dir: ${basePath}`);

    disposable.push(
        vscode.commands.registerCommand("timer.playSound", function () {
            // The code you place here will be executed every time your command is executed

            // Display a message box to the user
            vscode.window.showInformationMessage("Playing Sound");
            player.play(soundFilePath, player.soundSettings).then(() => {
                console.log("sound has played");
            });
        })
    );

    context.subscriptions.push(disposable);
    for (const item in disposable) {
        context.subscriptions.push(item);
    }
}
exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
