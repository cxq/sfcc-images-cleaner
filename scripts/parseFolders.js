
/**
 * 
 * @param {string} inputSource absolute path of the input folder
 * @param {object} data
 */

module.exports = (inputSource, data) => {
    console.time('Parse folders');
    const recursive = require("recursive-readdir");

    return new Promise((resolve, reject) => {
        recursive(inputSource, ['.DS_Store']).then((files) => {
            resolve({
                ...data,
                folderImages: files,
                totalFolderImages: files.length
            });
            console.timeEnd('Parse folders');
        }, reject);
    });
};