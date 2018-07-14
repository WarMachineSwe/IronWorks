/**
 * Create a message to say something about the editor:
 * - you have a project open and want open another? Are you sure that you don't want save?
 * */
function reloadPage (change, msg) {
    if (change) {
        var message = 'Have you save your project?\n' + msg + '\n\nPress OK to continue or Cancel to stay on the current page.';
        return confirm(message);
    }
    return true
}