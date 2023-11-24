import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  comment: string;
}
