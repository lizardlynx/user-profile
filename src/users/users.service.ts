import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { LoginExistsException } from 'src/exceptions/loginExists.exception';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import * as crypto from 'crypto';
import { EmailException } from 'src/exceptions/email.exception';
import { MailService } from 'src/utils/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { imageSizes } from 'src/utils/image.service';
import { Aws3Service } from 'src/utils/aws3.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly mailService: MailService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly aws3Service: Aws3Service,
  ) {}

  async getUserByLogin(login: string, fields: string = ''): Promise<User> {
    const user = await this.userModel.findOne({ login }).select(fields).exec();
    return user as unknown as User;
  }

  async getUserByHash(hash: string): Promise<User> {
    const user = await this.userModel.findOne({ hash }).exec();
    return user as unknown as User;
  }

  async getUserProfile(login: string): Promise<User> {
    const user = await this.getUserByLogin(
      login,
      'firstName surname login email birthDate profilePicture',
    );
    if (!user) throw new NotFoundException();
    return user;
  }

  async signUp(createUserDto: CreateUserDto) {
    const loginExists = await this.getUserByLogin(createUserDto.login);
    if (loginExists) throw new LoginExistsException();
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = hashedPassword;
    const hash = crypto.randomBytes(20).toString('hex');
    const userData = {
      ...createUserDto,
      active: false,
      hash,
    };
    const createdUser = new this.userModel(userData);
    await createdUser.save();

    const htmlText = `
      <h2>Verify Your Account</h2>
      <p>Click the link below to verify your account: </p>
      <a href="${process.env.APP_DOMAIN}/users/profile/verify?hash=${hash}">${process.env.APP_DOMAIN}/users/profile/verify?hash=${hash}</a>
    `;
    const success = await this.mailService.sendMail(
      createUserDto.email,
      'Verify your account on UserProfile',
      htmlText,
    );

    if (!success) throw new EmailException();
    return {
      message: 'Now, please verify account. See message on your email.',
    };
  }

  async updateProfileData(updateUserDto: UpdateUserDto, login: string) {
    const res = await this.userModel.updateOne(
      { login },
      { $set: { ...updateUserDto } },
    );
    if (res.acknowledged && res.modifiedCount)
      return {
        message: 'Update successfull!',
      };
    return {
      message: 'Update unsuccessfull!',
    };
  }

  async verifyUserProfile(hash: string) {
    const res = await this.userModel.updateOne(
      { hash },
      { $unset: { hash: 1, active: 1 } },
    );

    if (!res.matchedCount) throw new NotFoundException();
    else if (!res.modifiedCount)
      return {
        message: 'Your account was already verified!',
      };
    return {
      message: 'Your account was successfully verified!',
    };
  }

  async setProfilePicture(login: string, fileName: string) {
    const paths = imageSizes.map(
      (type) =>
        `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.MY_AWS_S3_REGION}.amazonaws.com/${fileName}-${type}.png`,
    );
    const user = await this.getUserByLogin(login);
    if ('profilePicture' in user) {
      const images = user.profilePicture;
      for (const image of images) {
        await this.aws3Service.delete(image.split('/').pop());
      }
    }

    const res = await this.userModel.updateOne(
      { login },
      { $set: { profilePicture: paths } },
    );
    if (res.acknowledged)
      return {
        message: 'Update successfull!',
      };
    throw new NotFoundException();
  }
}
