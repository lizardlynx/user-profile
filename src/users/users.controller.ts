import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Put,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUserAuthRequest } from 'src/types/request.type';
import { SharpPipe } from 'src/pipes/sharp.pipe';
import { imageInterceptorOptions } from 'src/utils/image.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':login')
  async getUserByLogin(@Param('login') login: string) {
    return await this.usersService.getUserProfile(login);
  }

  @Post('new')
  async signUp(
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    createUserDto: CreateUserDto,
  ) {
    return await this.usersService.signUp(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfileData(
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return await this.usersService.updateProfileData(
      updateUserDto,
      req.user.username,
    );
  }

  @Get('profile/verify')
  async verifyUserProfile(@Query('hash') hash: string) {
    return await this.usersService.verifyUserProfile(hash);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', imageInterceptorOptions))
  @Post('profile/image')
  async updateProfileImage(
    @UploadedFile(SharpPipe)
    file: string,
    @Req() req: IUserAuthRequest,
  ) {
    return await this.usersService.setProfilePicture(req.user.username, file);
  }
}
