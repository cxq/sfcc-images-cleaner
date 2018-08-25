module.exports = (outputSource, data) => {
    const chalk = require('chalk');

    console.log(chalk.green.bold('\n---------------------------------------------------------------'));
    console.log(chalk.green.bold('Successfully finished'));
    console.log(chalk.green.bold('---------------------------------------------------------------\n'));

    console.log(chalk.bold('Total XML images: '), data.totalXmlImages);
    console.log(chalk.bold('Total images in the folder: '), data.totalFolderImages);

    console.log('\n---------------------------------------------------------------\n');

    console.log(chalk.bold('Folder copied: ', chalk.magenta(outputSource)));
    console.log(chalk.bold('Total images copied: '), chalk.green(data.totalCopiedImages));
    console.log(chalk.bold('Total images skipped: '), data.totalSkippedImages);

    return data;
};