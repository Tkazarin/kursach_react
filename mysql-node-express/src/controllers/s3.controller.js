const { S3Client, GetObjectCommand, HeadObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const
    s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        },
    });
const
    BUCKET = process.env.AWS_BUCKET_NAME;
class S3Controller {
    getPresignedUrls = async (req, res, next) => {
        try {
            // {
            //   "imageFileName": "profile_pic_1.jpg",
            //   "downloadFileName": "resume.docx"
            // }
            const {imageFileName, downloadFileName} = req.body;

            const filesToCheck = [
                imageFileName,
                downloadFileName,
            ].filter(Boolean); // убирает undefined и null

            const result = await Promise.all(
                filesToCheck.map(async (fileName) => {
                    try {
                        await s3.send(new HeadObjectCommand({
                            Bucket: BUCKET,
                            Key: fileName,
                        }));

                        const command = new GetObjectCommand({
                            Bucket: BUCKET,
                            Key: fileName,
                        });
                        const url = await getSignedUrl(s3, command, {expiresIn: 90000});
                        console.log(url);
                        return {
                            fileName,
                            url,
                        };
                    } catch (error) {
                        return {
                            fileName,
                            url: null,
                        };
                    }
                })
            );

            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Failed to get presigned URLs'});
        }
    };

    getPresignedUploadUrls = async (req, res) => {
        try {
            // например: ["test.JPG", "test_2.JPG"]
            const { fileNames } = req.body;

            if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
                return res.status(422).json({ error: 'No files provided' });
            }

            const result = await Promise.all(
                fileNames.map(async (fileName) => {
                    const command = new PutObjectCommand({
                        Bucket: BUCKET,
                        Key: fileName
                    });

                    const url = await getSignedUrl(s3, command, { expiresIn: 900 });
                    console.log(url);
                    return {
                        fileName,
                        url,
                    };
                })
            );
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to get presigned upload URLs' });
        }
    };

}
// Экспортируй по вкусу
module.exports = new S3Controller;
