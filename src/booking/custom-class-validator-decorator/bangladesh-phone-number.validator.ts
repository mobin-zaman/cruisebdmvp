import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js';
import { registerDecorator, ValidationOptions } from 'class-validator';

//TODO: provide proper validation

export function IsBangladeshPhoneNumber(validationOptions?: ValidationOptions) {
  return function(object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Provide valid bangladeshi phone number',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          try {
            parsePhoneNumberWithError(value, 'BD');
            return true;
          } catch (error) {
            if (error instanceof ParseError) {
              console.log(error.message);
              return false;
            } else {
              return false;
            }
          }
        },
      },
    });
  };
}
