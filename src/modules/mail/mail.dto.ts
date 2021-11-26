import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty()
  public subject: string;

  @IsString()
  @IsOptional()
  public template = 'default';

  @IsString()
  @IsOptional()
  public content: string;

  @IsOptional()
  public file: Express.Multer.File;
}

export class InputAttachments {
  public filename?: string;
  public content?: any;
  public path?: string;
  public contentType: string;
  public cid: string;
}