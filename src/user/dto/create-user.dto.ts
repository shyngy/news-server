import { IsEmail, Length, Matches } from 'class-validator';
import { UniqueOnDatabase } from '../../auth/validations/UniqueValidation';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @Length(3, 50, { message: 'Неверное имя пользователя' })
  fullName: string;

  @IsEmail({ statusCode: 500 }, { message: 'неверная почта' })
  @UniqueOnDatabase(UserEntity, {
    message: '$value почта уже есть',
  })
  email: string;

  @Length(8, 180, { message: 'неверный пароль' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'пароль должен содержать заглавные и прописные буквы на латинском языке',
  })
  password?: string;
}
