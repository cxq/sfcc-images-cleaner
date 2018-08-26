const recursive = require("recursive-readdir");

module.exports = (inputSource, data) => {
    console.time('Parse folders');
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