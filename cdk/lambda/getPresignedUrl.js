const { S3Client } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

exports.handler = async (event) => {

    console.log("Received event:", JSON.stringify(event));
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error("Error parsing event body:", error.message);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request body" }),
        };
    }

    const { key } = body || {};

    try {
        if (!process.env.BUCKET_NAME) {
            throw new Error('BUCKET_NAME environment variable is not defined.');
        }

        const BUCKET_NAME = process.env.BUCKET_NAME;
        if (!process.env.CLOUDFRONT_URL) {
            throw new Error('CLOUDFRONT_URL environment variable is not defined.');
        }
        const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

        const params = {
            Bucket: BUCKET_NAME,
            Key: key, 
            Expires: 3600,
            ContentType: 'multipart/form-data'
        };

        const s3Client = new S3Client({ region: process.env.AWS_REGION });

        const presignedPost = await createPresignedPost(s3Client, params);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": CLOUDFRONT_URL,
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({ url: presignedPost.url, fields: presignedPost.fields, bucketName: BUCKET_NAME }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": process.env.CLOUDFRONT_URL,
            },
            body: JSON.stringify({ message: error.message }),
        };
    }
};