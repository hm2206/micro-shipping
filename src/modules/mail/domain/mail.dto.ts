import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class SendMailDto {
  @IsNotEmpty()
  public subject: string;

  @IsString()
  @IsOptional()
  public template = 'default';

  @IsString()
  @IsOptional()
  public displayLink = '';

  @IsString()
  @IsOptional()
  public link = '';

  @IsString()
  @IsOptional()
  public content: string;

  @IsOptional()
  public file: Express.Multer.File;
}

export class SendMailToDto extends PartialType(SendMailDto) {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  public objectId?: any;
}

export class InputAttachments {
  public filename?: string;
  public content?: any;
  public path?: string;
  public contentType: string;
  public cid: string;
}