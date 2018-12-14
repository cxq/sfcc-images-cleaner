const path = require('path');
const fs = require('fs-extra');

function copyImage(folderImage, imagePath, outputSource) {
    return fs.copy(folderImage, path.join(outputSource, 'build' ,imagePath)).then(() => folderImage);
}

/**
 * 
 * @param {string} inputSource absolute path of the input folder
 * @param {string} outputSource absolute path of the output folder
 * @param {object} data
 */

module.exports = (inputSource, outputSource, parseMode, data) => {
    const performance = require('execution-time')();
    const chalk = require('chalk');
    const getPathFrom = require('../utils/getPathFrom');
    performance.start();

    console.log(`Starting '${chalk.cyan('Filtering & copy images')}'...`);

    const sourceDirname = inputSource.split(path.sep).pop();

    function createOuput() {
        return new Promise((resolve, reject) => {
            fs.ensureDir(outputSource, (error) => {
                if (error) {
                    throw error;
                }

                const xmlImages = data.xmlImages.splice();
                const copyPromises = [];
                const copiedImages = [];
                const skippedImages = [];

                data.folderImages.forEach((folderImage) => {
                    let imagePath = getPathFrom(sourceDirname, folderImage);
                    let localeFolder = '';
                    if (parseMode === 'all') {
                        const imagePathArray = imagePath.split('/');
                        localeFolder = imagePathArray.shift();
                        imagePath = imagePathArray.join('/');
                    }
                    const imgIndex = data.xmlImages.indexOf(imagePath);

                    // Copy image only if they are reference in the XML
                    if (imgIndex > -1) {
                        xmlImages.splice(imgIndex, 1);  // Remove the path from the XML array to optimize performance and reduce search time
                        return copyPromises.push(copyImage(folderImage, imagePath, [outputSource,localeFolder].join(path.sep))
                            .then((copiedImage) => copiedImages.push(copiedImage)));
                    } else {
                        skippedImages.push(folderImage);
                    }
                });
                return Promise.all(copyPromises).then(() => {
                    const totalCopiedImages = copiedImages.length;
                    const totalSkippedImages = skippedImages.length;
                    const results = performance.stop();

                    console.log(`Finished '${chalk.cyan('Filtering & copy images')}' after ${chalk.magenta(results.time + 'ms')}`);
                    
                    return {
                        ...data,
                        copiedImages,
                        skippedImages,
                        totalCopiedImages,
                        totalSkippedImages,
                        totalNotFoundImages: data.totalXmlImages - totalCopiedImages, // Images that are in the XML but were not found in the folders
                    }
                }).then(resolve, reject);
            });
        });
    }

    return new Promise((resolve, reject) => {
        if (fs.pathExists(outputSource)) {
            fs.emptyDir(outputSource, () => {
                createOuput().then(resolve, reject);;
            });
        } else {
            createOuput().then(resolve, reject);;
        }
    });
};