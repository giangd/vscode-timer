// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = [];
    console.log('Congratulations, your extension "timer" is now active!');


    disposable.push(
        vscode.commands.registerCommand("timer.playSound", function () {
            // The code you place here will be executed every time your command is executed

            // Display a message box to the user
            vscode.window.showInformationMessage("Playing Sound");
        })
    );

    context.subscriptions.push(disposable);
    for (const item in disposable) {
        context.subscriptions.push(item);
    }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
