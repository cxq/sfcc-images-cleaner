/**
 * 
 * @param {string} outputSource absolute path of the output folder
 * @param {object} data
 */

module.exports = (outputSource, data) => {
    const chalk = require('chalk');
    const path = require('path');

    console.log(chalk.green.bold('\n---------------------------------------------------------------'));
    console.log(chalk.green.bold('Successfully finished'));
    console.log(chalk.green.bold('---------------------------------------------------------------\n'));

    console.log('Total XML images: ', data.totalXmlImages);
    console.log('Total images in the folder: ', data.totalFolderImages);

    console.log('\n---------------------------------------------------------------\n');

    console.log('Folder copied: ', chalk.magenta(path.join(outputSource, 'build')));
    if (data.optimizedImages) {
        console.log('Folder with optimization copied: ', chalk.magenta(path.join(outputSource, 'build-optimized')));
    }
    console.log('Total images copied: ', chalk.green(data.totalCopiedImages));
    console.log('Total images skipped: ', data.totalSkippedImages);
    console.log('Total images in XML not found in the folder: ', chalk.red(data.totalNotFoundImages));

    if (data.totalOptimizedSize) {
        console.log('Total size of the optimized image folder: ', chalk.green(`${(data.totalOptimizedSize / 1000000).toFixed(2)}mb`)); // size in mb
    }

    return data;
};