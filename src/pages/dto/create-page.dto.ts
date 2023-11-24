import { IsNotEmpty } from 'class-validator';

export class CreatePageDto {
  @IsNotEmpty()
  customUrl: string;

  @IsNotEmpty()
  pageContent: string;
}
