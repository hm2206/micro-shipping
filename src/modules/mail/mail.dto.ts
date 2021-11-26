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
}