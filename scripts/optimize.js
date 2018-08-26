/**
 * 
 * @param {array} images List of images that were copied
 * @param {string} outputSource absolute path of the output folder
 * @param {number} quality Compression quality, in range 0 (worst) to 100 (perfect). 
 */

module.exports = (images, outputSource, quality = 60) => {
    const performance = require('execution-time')();
    const chalk = require('chalk');
    performance.start();

    console.log(`Starting '${chalk.cyan('Optimize images')}'...`);

    const path = require('path');
    const imagemin = require('imagemin');
    const imageminMozjpeg = require('imagemin-mozjpeg');
    const imageminPngquant = require('imagemin-pngquant');

    return imagemin(images, path.join(outputSource, 'build-optimized'), {
        verbose: true,
        plugins: [
            imageminMozjpeg({ quality }),
            imageminPngquant({ quality }),
        ],
    }).then(() => {
        const results = performance.stop();
        console.log(`Finished '${chalk.cyan('Optimize images')}' after ${chalk.magenta(results.time + 'ms')}`);
    });
};