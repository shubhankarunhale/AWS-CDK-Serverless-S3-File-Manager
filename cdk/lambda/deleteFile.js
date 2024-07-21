const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

exports.handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME;
    const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

    const s3Client = new S3Client({ region: process.env.AWS_REGION });

    const key = event.queryStringParameters.key;

    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(command);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": CLOUDFRONT_URL,
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
                "Access-Control-Allow-Methods": "DELETE"
            },
            body: JSON.stringify({ message: 'File deleted successfully' }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": CLOUDFRONT_URL,
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
                "Access-Control-Allow-Methods": "DELETE"
            },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
