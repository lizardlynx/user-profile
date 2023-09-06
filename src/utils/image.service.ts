import { ImageResizerType } from 'src/types/imageResizer.type';
import * as sharp from 'sharp';
import { UnsupportedFileTypeException } from 'src/exceptions/unsupportedFileType.exception';

export function saveResizedImage(
  file: Express.Multer.File,
  type: ImageResizerType,
  path: string,
) {
  return sharp(file.buffer)
    .resize(type, type)
    .png()
    .toFile(path + '.png');
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
