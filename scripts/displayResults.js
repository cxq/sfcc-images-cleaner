module.exports = (outputSource, data) => {
    const chalk = require('chalk');

    console.log(chalk.bold('Total XML images: '), data.totalXmlImages);
    console.log(chalk.bold('Total images in the folder: '), data.totalFolderImages);

    console.log('\n---------------------------------------------------------------');
    console.log(chalk.bold('New folder created: ', chalk.magenta(outputSource)));
    console.log('---------------------------------------------------------------\n');
    console.log(chalk.bold('Total images copied: '), data.totalCopiedImages);
    console.log(chalk.bold('Total images skipped: '), data.totalDeletedImages);
};