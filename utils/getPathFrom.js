/**
 * This is about cleaning the path to get only the base folder name and files
 * ie. ../../default-catalog/product/images/myImage.jpg -> product/images/myImage.jpg 
 * @param {string} startDirectory image folders that is parsed
 * @param {string} filePath
 * @param {boolean} skip
 */
module.exports = (startDirectory, filePath, skipBasename = false) => {
    const path = require('path');
    const imgPaths = filePath.split(path.sep);
    let dirnameReached = false;
    let finalPath = [];

    for (let i = 0, l = imgPaths.length; i < l; i++) {
        const pathElement = imgPaths[i];
        if (!dirnameReached) {
            // if sourceDirname is reached, we can start build the path
            if (startDirectory === pathElement) {
                dirnameReached = true;
            }
        } else {
            finalPath.push(pathElement);
        }
    }
    return finalPath.join('/');
}