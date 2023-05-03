import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { fromBuffer } from 'file-type';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(buffer: Buffer, res: Response): Promise<string> {
    try {
      const fileType = await fromBuffer(buffer);

      if (!fileType || !fileType.mime.startsWith('image/')) {
        throw new BadRequestException(`The file must be an image`);
      }

      const secure_url = await new Promise<string>((resolve, reject) => {
        const stream = v2.uploader.upload_stream({}, (error, result) => {
          if (error) {
            console.log('Cloudinary error: ', error);
            reject(error);
          } else {
            console.log('Upload succesful:', result);
            resolve(result.secure_url);
          }
        });
        stream.write(buffer);
        stream.end();
      });

      return secure_url;
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(500).json({ message: 'Server internal error' });
      }
    }
  }
}
