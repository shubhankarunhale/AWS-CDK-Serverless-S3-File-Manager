const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

exports.handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME;
    const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

    const s3Client = new S3Client({ region: process.env.AWS_REGION });

    try {
        // List objects in the bucket
        const listObjectsCommand = new ListObjectsV2Command({
            Bucket: bucketName,
        });

        const { Contents = [] } = await s3Client.send(listObjectsCommand);

        // Generate a list of file keys
        const fileList = Contents.map(object => ({
            key: object.Key
        }));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": CLOUDFRONT_URL,
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
                "Access-Control-Allow-Methods": "GET"
            },
            body: JSON.stringify(fileList),
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
