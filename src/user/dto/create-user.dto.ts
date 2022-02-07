import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @Length(8, 180, { message: 'неверный пароль' })
  fullName: string;

  @IsEmail({ statusCode: 500 }, { message: 'неверная почта' })
  email: string;

  @Length(8, 180, { message: 'неверный пароль' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'пароль должен содержать заглавные и прописные буквы на латинском языке',
  })
  password?: string;
}
