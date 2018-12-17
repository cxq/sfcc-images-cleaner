/**
 * Flatten the catalog object
 * If objectType is library, there are multiple locations to search in as well as multiple filetypes (pdf, css, html)
 * We consider other filetypes besides images so that nothing is lost in terms of functionality, at least for the moment.
 * 
 * @param {array} sfccObjects
 * @param {string} objectType
 */
function getImages(sfccObjects, objectType) {
    var images = [];
    if (objectType === 'catalog') {
        images = sfccObjects.filter((sfccObject) => sfccObject.images)
            .map((sfccObject) => sfccObject.images)
            .reduce((accumulator, arr) => accumulator.concat(arr))
            .map((group) => group['image-group'])
            .reduce((accumulator, arr) => accumulator.concat(arr))
            .map((img) => img.image)
            .reduce((accumulator, arr) => accumulator.concat(arr))
            .map(img => img.$.path);
    } else if (objectType === 'library') {
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
        images = sfccObjects.filter((sfccObject) => sfccObject['custom-attributes'])
            .map((sfccObject) => sfccObject['custom-attributes'])
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
    }

    return [ ...new Set(images) ];  // Remove duplicated
}

/**
 * 
 * @param {string} path path of the XML file
 */
module.exports = (path, objectType) => {
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

                const xmlImages = getImages(objectType === 'catalog' ? result.catalog.product : [].concat(result.library.folder, result.library.content), objectType);

                resolve({
                    sfccObjectID: objectType === 'catalog' ? result.catalog.$['catalog-id'] : 'library',
                    xmlImages,
                    totalXmlImages: xmlImages.length,
                });
                const results = performance.stop();
                console.log(`Finished '${chalk.cyan('XML Parsing')}' after ${chalk.magenta(results.time + 'ms')}`);
            });
        });
    });

};