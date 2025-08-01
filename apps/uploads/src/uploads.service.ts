import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/images/${file.filename}`,
    };
  }
}
