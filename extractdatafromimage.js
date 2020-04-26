//Sample Project
var path = require('path');
var fs = require('fs');
const sharp = require('sharp');
const tesseract = require('node-tesseract-ocr')

const fileName = "./testimage.jpg"
const rotatedimage = "./rotatedimage.jpg"
const config = {
    lang: 'eng',
    oem: 1,
    psm: 3
}

//The Tesseract can process the file when the file is in 0,90 angles
//Continuously rotate the image 5 degrees from the current position until the contents are extracted successfully

var startingAngle = 5;

var rotateImage = function (fileName, startingAngle) {
    sharp(fileName)
        .rotate(startingAngle)
        .toBuffer()
        .then(data => {
            fs.writeFile(rotatedimage, data, 'binary', function (err, data) {
                if (err) console.log("Error occurred : " + err)
            });
            extractContent(rotatedimage);
        })
        .catch(err => { console.log("Error Occurred :" + err); });
}

var extractContent = function (filename) {
    tesseract
        .recognize(filename, config)
        .then(text => {
            console.log("The image rotated at at present @" + startingAngle + " angle");
            if (text.length > 5) {
                console.log("**************************************************************************");
                console.log("Extract content length is :" + text.length);
                console.log("Extracted content : " + text);
                console.log("**************************************************************************");                
            }
            else {
                if (startingAngle <= 360) {
                    startingAngle += 5;
                    console.reset();
                    console.log("Rotating the image @" + startingAngle);
                    rotateImage(fileName, startingAngle);
                }
                else {
                    console.log("Data extraction failed!!!");
                }
            }
        })
        .catch(err => {
            console.log('error:', err)
        })
}

console.reset = function () {
    return process.stdout.write('\033c');
}

extractContent(fileName);
