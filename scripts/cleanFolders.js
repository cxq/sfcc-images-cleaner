const path = require('path');
const fs = require('fs-extra');

/**
 * This is about cleaning the path to get only the base folder name and files
 * ie. ../../default-catalog/product/images/myImage.jpg -> product/images/myImage.jpg 
 * @param {string} sourceDirname image folders that is parsed
 * @param {string} imagePath img path from image folder
 */
function resolveImagePath(sourceDirname, imagePath) {
    const imgPaths = imagePath.split(path.sep);
    let dirnameReached = false;
    let finalPath = [];

    for (let i = 0, l = imgPaths.length; i < l; i++) {
        const pathElement = imgPaths[i];
        if (!dirnameReached) {
            // if sourceDirname is reached, we can start build the path
            if (sourceDirname === pathElement) {
                dirnameReached = true;
            }
        } else {
            finalPath.push(pathElement);
        }
    }
    return finalPath.join(path.sep);
}

function copyImage(folderImage, imagePath, outputSource) {
    return fs.copy(folderImage, path.join(outputSource, imagePath)).then(() => folderImage);
}

module.exports = (inputSource, outputSource, data) => {
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
                    const imagePath = resolveImagePath(sourceDirname, folderImage);
                    const imgIndex = data.xmlImages.indexOf(imagePath);

                    // Copy image only if they are reference in the XML
                    if (imgIndex > -1) {
                        xmlImages.splice(imgIndex, 1);  // Remove the path from the XML array to optimize performance and reduce search time
                        return copyPromises.push(copyImage(folderImage, imagePath, outputSource)
                            .then((copiedImage) => copiedImages.push(copiedImage)));
                    } else {
                        skippedImages.push(folderImage);
                    }
                });
                return Promise.all(copyPromises).then(() => {
                    const totalCopiedImages = copiedImages.length;
                    const totalSkippedImages = skippedImages.length;

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