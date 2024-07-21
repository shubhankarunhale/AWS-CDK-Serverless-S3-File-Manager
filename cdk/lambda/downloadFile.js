const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

exports.handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME;
    const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

    const s3Client = new S3Client({ region: process.env.AWS_REGION });

    const key = event.queryStringParameters.key;

    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        // Generate a presigned URL for the object
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": CLOUDFRONT_URL,
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
                "Access-Control-Allow-Methods": "GET"
            },
            body: JSON.stringify({ url }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": CLOUDFRONT_URL,
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
                "Access-Control-Allow-Methods": "GET"
            },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
