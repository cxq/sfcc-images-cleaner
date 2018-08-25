const recursive = require("recursive-readdir");

module.exports = (inputSource, data) => {
    return new Promise((resolve, reject) => {
        recursive(inputSource, ['.DS_Store']).then((files) => {
            resolve({
                ...data,
                folderImages: files,
                totalFolderImages: files.length
            })
        }, reject);
    });
};