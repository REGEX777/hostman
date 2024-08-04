import multer from 'multer';

const upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: 'hostman-cloud-bucket',
      acl: 'public-read', 
      metadata: function (req, file, cb) {
        cb(null, {
          fieldName: file.fieldname
        });
      },
      key: function (req, file, cb) {
        const extension = file.originalname.split('.').pop();
        const name = `${nanoid(10)}.${extension}`;
        cb(null, name);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    limits: {
      fileSize: 20 * 1024 * 1024, // 10MB in bytes
    },
  });




  
async function storageVerify(req, res, next) {
    const uploadSize = Number(((req.file.size) / (1024 * 1024)).toFixed(2));
  
    const bucketName = '-bucket' 
  
    try {
      const listObjectsParams = {
        Bucket: bucketName,
      };
  
      const s3Objects = await s3Client.send(new ListObjectsV2Command(listObjectsParams));
  
      let totalStorageUsed = 0;
      s3Objects.Contents.forEach((object) => {
        totalStorageUsed += object.Size;
      });
  
      const totalStorageUsedMB = totalStorageUsed / (1024 * 1024);
  
      const defaultStorageLimit = res.locals.user.defaultStorage; 
  
      // Calculate remaining storage
      const remainingStorage = defaultStorageLimit - totalStorageUsedMB;
  
      console.log(uploadSize);
      console.log(totalStorageUsedMB);
      console.log(totalStorageUsedMB + uploadSize);
      console.log(defaultStorageLimit);
  
      if (totalStorageUsedMB + uploadSize <= defaultStorageLimit) {
        next();
      } else {
        const filepath = `uploads/${req.file.key}`; 
  
        // Delete the file from the S3 bucket
        const deleteObjectParams = {
          Bucket: bucketName,
          Key: filepath,
        };
  
        await s3Client.send(new DeleteObjectCommand(deleteObjectParams));
  
        res.status(507).json({
          code: 507,
          message: `Storage Full, Your file size was ${uploadSize}MB. But the storage remaining is ${remainingStorage.toFixed(2)}MB`,
        });
      }
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({
        code: 500,
        message: 'Error verifying storage',
      });
    }
  }
  
  app.get('/', (req, res)=>{
    res.send('Unauthorized')
  })
  