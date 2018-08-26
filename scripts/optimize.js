/**
 * @param {array} images List of images that were copied
 * @param {string} inputSource absolute path of the input folder
 * @param {string} outputSource absolute path of the output folder
 * @param {object} options  Options related to the image compression
 */

module.exports = (images, inputSource, outputSource, options) => {
    // Imagemin doesn't keep folder structure and build all images in a flat directory
    // We can't pass a glob into the source of imagemin function and it requires to execute imagemin per file with an different output in order to keep folder structure
    function optimImage(imagePath) {
        const path = require('path');
        const imagemin = require('imagemin');
        const getPathFrom = require('../utils/getPathFrom');
        const imageminMozjpeg = require('imagemin-mozjpeg');
        const imageminPngquant = require('imagemin-pngquant');
        // Compression quality, in range 0 (worst) to 100 (perfect). 
        const quality = options.quality || 60; // default quality to 60
    
        const sourceDirectory = inputSource.split(path.sep).pop();
        return imagemin([imagePath], path.join(outputSource, 'build-optimized', getPathFrom(sourceDirectory, path.dirname(imagePath))), {
            verbose: true,
            plugins: [
                imageminMozjpeg({ quality }),
                imageminPngquant({ quality }),
            ],
        }).then((files) => files[0]) // We only pass one image
    }

    const performance = require('execution-time')();
    const chalk = require('chalk');
    performance.start();

    console.log(`Starting '${chalk.cyan('Optimize images')}'...`);
    let totalOptimizedSize = 0; // in bytes

    let promises = [];
    let optimizedImages = [];
    
    for (let i = 0, l = images.length; i < l; i++) {
        promises.push(optimImage(images[i]).then((file) => {
            const fileSize = file.data.length;
            console.log(chalk.green('✔ ') + file.path + chalk.gray(` (optimized to ${(fileSize/1000).toFixed(2)} KB)`));
            totalOptimizedSize += fileSize;
            optimizedImages.push(file.path);
        }));
    }

    return Promise.all(promises).then(() => {
        const results = performance.stop();
        console.log(`Finished '${chalk.cyan('Optimize images')}' after ${chalk.magenta(results.time + 'ms')}`);
        return {
            optimizedImages,
            totalImageOptimized: optimizedImages.length,
            totalOptimizedSize,
        }
    });
};