import { ImageResizerType } from 'src/types/imageResizer.type';
import * as sharp from 'sharp';
import { UnsupportedFileTypeException } from 'src/exceptions/unsupportedFileType.exception';

export async function processImage(
  file: Express.Multer.File,
  type: ImageResizerType,
) {
  return await sharp(file.buffer).resize(type, type).png().toBuffer();
}

export const imageSizes: ImageResizerType[] = [
  ImageResizerType.BIG,
  ImageResizerType.AVG,
  ImageResizerType.SMALL,
];

export const imageInterceptorOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) cb(null, true);
    else cb(new UnsupportedFileTypeException(), false);
  },
};
