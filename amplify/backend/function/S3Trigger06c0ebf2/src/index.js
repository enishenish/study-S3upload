// dependencies
const AWS = require('aws-sdk');
const util = require('util');
//const sharp = require('sharp');

// get reference to S3 client
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {

    // Read options from the event parameter.
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    console.log(srcKey);
    const dstBucket = "outeramplify-s3test-destination";
    console.log(dstBucket);
    const dstKey    =  srcKey;
    console.log(dstKey);

    // Infer the image type from the file suffix.
    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }

    // Check that the image type is supported  
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "png") {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    // Download the image from the S3 source bucket. 
    try {
        const params = {
            Bucket: srcBucket,
            Key: srcKey
        };
        var originImage = await s3.getObject(params).promise();
        console.log(originImage);
    } catch (error) {
        console.log(error);
        return;
    }  

    //TODO resize function
    // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
    //const width  = 200;

    // Use the Sharp module to resize the image and save in a buffer.
    //try { 
    //    var buffer = await sharp(originImage.Body).resize(width).toBuffer();
    //        
    //} catch (error) {
    //    console.log(error);
    //    return;
    //} 

    // Upload the thumbnail image to the destination bucket
    try {
        const dstParams = {
            Bucket: dstBucket,
            Key: dstKey,
            Body: originImage.Body,
            ContentType: "image"
        };

        const putResult = await s3.putObject(dstParams).promise(); 
        console.log(putResult);
    } catch (error) {
        console.log(error);
        return;
    } 
        
    console.log('Successfully copied form' + srcBucket + '/' + srcKey +
        ' to ' + dstBucket + '/' + dstKey); 
};