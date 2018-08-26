
/**
 * 
 * @param {string} inputSource absolute path of the input folder
 * @param {object} data
 */

module.exports = (inputSource, data) => {
    const performance = require('execution-time')();
    const chalk = require('chalk');
    performance.start();

    console.log(`Starting '${chalk.cyan('Parse folders')}'...`);

    const recursive = require("recursive-readdir");

    return new Promise((resolve, reject) => {
        recursive(inputSource, ['.DS_Store']).then((files) => {
            resolve({
                ...data,
                folderImages: files,
                totalFolderImages: files.length
            });
            const results = performance.stop();
            console.log(`Finished '${chalk.cyan('Parse folders')}' after ${chalk.magenta(results.time + 'ms')}`);
        }, reject);
    });
};