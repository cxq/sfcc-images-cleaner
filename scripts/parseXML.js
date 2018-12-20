/**
 * Flatten the catalog object
 * @param {array} products
 */
function getProductImages(products) {
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
 * Flatten the library object
 * There are multiple locations to search in as well as multiple filetypes (pdf, css, html)
 * We consider other filetypes besides images so that nothing is lost in terms of functionality, at least for the moment.
 * 
 * @param {array} contentObjects - folders and content assets
 */
function getContentImages(contentObjects) {
    const fileTypesAllowed = [
        'jpg',
        'png',
        'gif',
        'pdf',
        'html',
        'css',
        'eot',
        'js',
        'json',
        'map',
        'mp4',
        'otf',
        'scss',
        'svg',
        'ttf',
        'txt',
        'woff',
        'woff2'
    ];
    const filePathRegexChars = [
        '\\w',
        '\\/',
        '\\-',
        '\\~',
        '\\(',
        '\\)',
        '\\.',
        '\\[',
        '\\]',
    ];
    const fileTypesRegex = new RegExp('(' + fileTypesAllowed.map((extension) => '\\.' + extension).join('|') + ')', 'gi');
    const filePathRegex = new RegExp('(' + fileTypesAllowed.map((extension) => '([' + filePathRegexChars.join('') + ']+)\\.' + extension).join('|') + ')', 'gmi');
    const contentFunctionsRegex = /(renderContentImage\(|responsiveSrc\(|responsivePicture\(|disUrl\()/gmi;
    const images = contentObjects.filter((contentObject) => contentObject['custom-attributes'])
        .map((contentObject) => contentObject['custom-attributes'])
        .reduce((accumulator, arr) => accumulator.concat(arr))
        .map((group) => group['custom-attribute'])
        .reduce((accumulator, arr) => accumulator.concat(arr))
        .filter((customAttr) => ['true', 'false'].indexOf(customAttr._) === -1 && fileTypesRegex.test(customAttr._))
        .map((customAttr) => customAttr._.match(filePathRegex) || [])
        .reduce((accumulator, arr) => accumulator.concat(arr))
        .map((imagePath) => {
            let cleanPath = imagePath[0] === '/' ? imagePath.substr(1) : imagePath;
            return cleanPath.replace(contentFunctionsRegex, '');
        });

    return [ ...new Set(images) ];  // Remove duplicates
}

/**
 * 
 * @param {string} path path of the XML file
 */
function parseProductsXML(path) {
    const performance = require('execution-time')();
    const chalk = require('chalk');
    const fs = require('fs');
    performance.start();

    console.log(`Starting '${chalk.cyan('Catalog XML Parsing')}'...`);

    var parseString = require('xml2js').parseString;

    return new Promise((resolve) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log('The Catalog XML file cannot be found');
                throw err;
            }
            parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                const xmlImages = getProductImages(result.catalog.product);

                resolve({
                    xmlImages,
                    totalXmlImages: xmlImages.length,
                });
                const results = performance.stop();
                console.log(`Finished '${chalk.cyan('Catalog XML Parsing')}' after ${chalk.magenta(results.time + 'ms')}`);
            });
        });
    });

}

/**
 * 
 * @param {string} path path of the XML file
 */
function parseContentXML(path) {
    const performance = require('execution-time')();
    const chalk = require('chalk');
    const fs = require('fs');
    performance.start();

    console.log(`Starting '${chalk.cyan('Library XML Parsing')}'...`);

    var parseString = require('xml2js').parseString;

    return new Promise((resolve) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log('The Library XML file cannot be found');
                throw err;
            }
            parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                const xmlImages = getContentImages([].concat(result.library.folder, result.library.content));

                resolve({
                    xmlImages,
                    totalXmlImages: xmlImages.length,
                });
                const results = performance.stop();
                console.log(`Finished '${chalk.cyan('Library XML Parsing')}' after ${chalk.magenta(results.time + 'ms')}`);
            });
        });
    });

}

module.exports = {
    parseProductsXML: parseProductsXML,
    parseContentXML: parseContentXML
};