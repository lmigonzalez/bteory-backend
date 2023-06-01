const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const crypto = require('crypto');
const sharp = require('sharp');

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function saveSingleImage(file) {
  //   console.log(file);

  const fileBuffer = await sharp(file.buffer)
    .resize({
      height: 500,
      width: 500,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  // Configure the upload details to send to S3
  const fileName = generateFileName();
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: file.mimetype,
  };

  // Send the upload to S3
  await s3Client.send(new PutObjectCommand(uploadParams));

  return fileName;
}

async function saveQuestionImages(files) {
  const filesArray = [];
  for (let file of files) {
    const fileBuffer = await sharp(file.buffer)
      .resize({
        height: 500,
        width: 500,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 },
      })
      .toBuffer();

    const fileName = generateFileName();
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    filesArray.push(fileName);
  }

  return filesArray;
}

async function getQuestionImage(questions) {
  const newQuestionObject = await Promise.all(
    questions.map(async (question) => {
      if (question.questionImg) {
        let url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: bucketName,
            Key: question.questionImg,
          }),
          { expiresIn: 604800 }
        );
        question.questionImg = url; // Replace the value with the URL
      }



	  
      await Promise.all(
		  question.explanation.map(async (explanation) => {
			  if (explanation.type === 'image') {
			//   console.log(explanation)
            let imageUrl = await getSignedUrl(
              s3Client,
              new GetObjectCommand({
                Bucket: bucketName,
                Key: explanation.image,
              }),
              { expiresIn: 604800 }
            );
            explanation.content = imageUrl; // Replace the content with the image URL
          }
        })
      );

      return question;
    })
  );

  console.log(newQuestionObject);
  return newQuestionObject;
}

module.exports = { saveSingleImage, getQuestionImage, saveQuestionImages };
