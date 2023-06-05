const bucket = require("../bucket");

async function uploadFile(file) {

  console.log("hellloo from uploadFile")
  console.log(file.originalname)
  
  const uniqueFilename = file.originalname;
  const blob = bucket.file(uniqueFilename);

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => {
      console.log("Error uploading file:", error);
      reject(error);
    });

    blobStream.on("finish", async () => {
      const [url] = await blob.getSignedUrl({
        expires: "03-17-2024",
        action: "read",
      });
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
}


module.exports = uploadFile;