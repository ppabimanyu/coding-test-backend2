import { IsNotEmpty } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  content: string;
}
