/**
 * 
 * @param {string} outputFile absolute path of the output folder
 * @param {object} data
 */
module.exports = (outputFile, data) => {
    const performance = require('execution-time')();
    const chalk = require('chalk');
    performance.start();

    console.log(`Starting '${chalk.cyan('Export Excel report')}'...`);

    const path = require('path');
    const fs = require('fs-extra');
    const xlsx = require('node-xlsx');
    const headers = ['XML images', 'Folder images', 'Images copied', 'Images skipped'];
    let totalLines = data.totalXmlImages >= data.totalFolderImages ? data.totalXmlImages : data.totalFolderImages;

    function createRow(index) {
        let row = [];
        row.push(data.xmlImages[index] || '');
        row.push(data.folderImages[index] || '');
        row.push(data.copiedImages[index] || '');
        row.push(data.skippedImages[index] || '');
        return row;
    }

    const rows = [];
    rows.push(headers);
    for (let i = 0, l = totalLines; i < l; i++) {
        rows.push(createRow(i));
    }
    const xlsBuffer = xlsx.build([{name: 'exportSFCCResults', data: rows}]);

    // If extension is missing, we fallback to CSV
    if (path.extname(outputFile) === '') {
        outputFile = outputFile + '.csv';
    }

    // Create the worksheet
    return fs.outputFile(outputFile, xlsBuffer).then(() => {
        const results = performance.stop();
        console.log(`Finished '${chalk.cyan('Export Excel report')}' after ${chalk.magenta(results.time + 'ms')}`);
        return {};
    });
}