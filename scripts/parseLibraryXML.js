const config = require('../sfcc.config');
const path = require('path');

function getMatchImages(pattern, content) {
    if (!pattern) {
        throw new Error(chalk.red('Missing pattern for content parsing, make sure to setup the sfcc.config.js file'));
    }

    const imagesFound = content.match(pattern);

    if (imagesFound) {
        return imagesFound.map(imagePath => {
            if (path.isAbsolute(imagePath)) {
                // ie: '/images/perfumes/01.jpg' to 'images/perfumes/01.jpg'
                return imagePath.substring(1); // we don't want absolute path
            }

            return imagePath;
        });
    }

    return [];
}

function findImages(content, contentType = 'basic') {
    const chalk = require('chalk');
    const imagesList = [];

    if (contentType === 'basic' && typeof content === 'string') {
        const pattern = config.library['images-parser'].basic;

        if (content) {
            imagesList.push(...getMatchImages(pattern, content));
        }

    } else if (contentType === 'html') {
        const patterns = config.library['images-parser'][contentType];
        if (!patterns || (patterns && !patterns.length)) {
            throw new Error(chalk.red('Missing pattern for HTML content parsing, make sure to setup the sfcc.config.js file'));
        }
        
        patterns.forEach(pattern => {
            if (content) {
                imagesList.push(...getMatchImages(pattern, content));
            }
        });
    }
    
    return imagesList;
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

                const contentList = result.library.content;
                const onlineContentList = []; // List of content that are 
                const offlineContentList = [];
                const onlineImages = []; // List of images that are in content flagged to online: true
                const offlineImages = []; // List of images that are in content flagged to online: true

                for (let i = 0, l = contentList.length; i < l; i ++) {
                    const content = contentList[i];
                    const isOnline = content['online-flag'][0] === 'true';
                    content.imagesList = [];
                    
                    if (content["custom-attributes"]) {
                        //parse each custom attribute of the content
                        content["custom-attributes"].forEach(item => {
                            item['custom-attribute'].forEach(attribute => {
                                let images = [];
                                // Attribute has xml:lang property we can assume that it will contain HTML
                                if (attribute.$['xml:lang']) {
                                    images = findImages(attribute['_'], 'html');
                                } else if(attribute['_']) { // Simple attribute
                                    images = findImages(attribute['_'], 'basic');
                                } else if (attribute.value) { // Attribute with different values
                                    attribute.value.forEach(val => {
                                        images.push(...findImages(val, 'basic'));
                                    });
                                }

                                if (images.length) {
                                    if (isOnline) {
                                        onlineImages.push(...images);
                                    } else {
                                        offlineImages.push(...images);
                                    }
                                }
                            });
                        });
                    }

                    if (isOnline) {
                        onlineContentList.push(content);
                    } else {
                        offlineContentList.push(content);
                    }
                }

                const cleanedOnlineImages = [...new Set(onlineImages)]; // Remove duplicated images
                const cleanedOfflineImages = [...new Set(offlineImages)]; // Remove duplicated images

                // We are only passing the images that
                resolve({
                    xmlImages: cleanedOnlineImages,
                    totalXmlImages: cleanedOnlineImages.length,
                });
                const results = performance.stop();
                console.log(`Finished '${chalk.cyan('XML Parsing')}' after ${chalk.magenta(results.time + 'ms')}`);
            });
        });
    });

};