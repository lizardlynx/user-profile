import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import { imageSizes } from 'src/utils/image.service';
import { saveResizedImage } from 'src/utils/image.service';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<string> {
    const filename = crypto.randomBytes(16).toString('hex');

    const filePromises = [];
    for (const type of imageSizes) {
      const imagePath = path.join(
        process.env.PROFILE_IMAGE_FOLDER,
        `${filename}-${type}`,
      );
      if (!fs.existsSync(process.env.PROFILE_IMAGE_FOLDER)) {
        fs.mkdirSync(process.env.PROFILE_IMAGE_FOLDER, { recursive: true });
      }
      filePromises.push(saveResizedImage(image, type, imagePath));
    }
    await Promise.all(filePromises);
    return filename;
  }
}
