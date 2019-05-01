/**
 * Flatten the catalog object
 * @param {array} products 
 */
function getImages(products) {
    const images = products.filter((product) => product.images)
    .map((product) => product.images)
    .reduce((accumulator, arr) => accumulator.concat(arr))
    .map((group) => group['image-group'])
    .reduce((accumulator, arr) => accumulator.concat(arr))
    .map((img) => img.image)
    .reduce((accumulator, arr) => accumulator.concat(arr))
    .map(img => img.$.path);

    return [ ...new Set(images) ];  // Remove duplicated
}

/**
 * 
 * @param {string} path path of the XML file
 */
module.exports = (path) => {
    const performance = require('execution-time')();
    const chalk = require('chalk');
    const fs = require('fs');
    performance.start();

    console.log(`Starting '${chalk.cyan('XML Parsing')}'...`);

    var parseString = require('xml2js').parseString;

    return new Promise((resolve) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log('The XML file cannot be found');
                throw err;
            }
            parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                const xmlImages = getImages(result.catalog.product);

                resolve({
                    catalogId: result.catalog.$['catalog-id'],
                    xmlImages,
                    totalXmlImages: xmlImages.length,
                });
                const results = performance.stop();
                console.log(`Finished '${chalk.cyan('XML Parsing')}' after ${chalk.magenta(results.time + 'ms')}`);
            });
        });
    });

};