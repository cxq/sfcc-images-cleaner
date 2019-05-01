module.exports = {
    "library": {
        "images-parser": {
            // Usually to parse basic attribute containing only simple text
            "basic": /[^:\"(]+\.(?:(jp[e]?g|png|webp))/gmi, 
            // Contains a list of pattern to grap the images from HTML type content
            "html": [
                /[^:"(,']+\.(gif|jp[e]?g|png|webp)/gmi,
            ]
        }
    }
}