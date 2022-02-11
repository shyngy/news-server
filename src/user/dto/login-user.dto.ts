import { IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Неверная почта' })
  email: string;

  @Length(8, 32, { message: 'Пароль должен быть миммум 6 символов' })
  password?: string;
}
