import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Entity, getRepository, Not } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { EntityOptions } from 'typeorm/decorator/options/EntityOptions';

@ValidatorConstraint({ async: true })
export class UniqueOnDatabaseExistConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: any, args: ValidationArguments) {
    const entity = args.object[`class_entity_${args.property}`];
    const req_id = args.object['id'] || -1;
    const items = await getRepository(entity).findAndCount({
      [args.property]: value,
      id: Not(req_id),
    });
    return !items[1];
  }
}

export function UniqueOnDatabase(
  entity: unknown,
  validationOptions?: ValidationOptions,
) {
  validationOptions = {
    ...{ message: '$value already exists. Choose another.' },
    ...validationOptions,
  };

  return function (object: any, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueOnDatabaseExistConstraint,
    });
  };
}
