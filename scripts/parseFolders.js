const recursive = require("recursive-readdir");

module.exports = (inputSource, data) => {
    return new Promise((resolve, reject) => {
        recursive(inputSource).then((files) => {
            resolve({
                ...data,
                folderImages: files,
            })
        }, reject);
    });
};