import { Injectable, PipeTransform } from '@nestjs/common';
import { imageSizes } from 'src/utils/image.service';
import { processImage } from 'src/utils/image.service';
import * as crypto from 'crypto';
import { Aws3Service } from 'src/utils/aws3.service';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  constructor(private readonly aws3Service: Aws3Service) {}

  async transform(image: Express.Multer.File): Promise<string> {
    const filename = crypto.randomBytes(16).toString('hex');

    for (const type of imageSizes) {
      const imageBuffer = await processImage(image, type);
      await this.aws3Service.upload(`${filename}-${type}.png`, imageBuffer);
    }
    return filename;
  }
}
