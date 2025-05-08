import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { sanitize } from 'class-sanitizer';

@Injectable()
export class ValidationService {
  async validateAndSanitize<T extends object>(
    dto: T,
    schema: new () => T,
  ): Promise<{ isValid: boolean; errors?: string[] }> {
    // Sanitizar datos
    const sanitizedData = plainToClass(schema, dto);
    sanitize(sanitizedData);

    // Validar datos
    const errors = await validate(sanitizedData, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        const constraints = error.constraints;
        return Object.values(constraints || {}).join(', ');
      });

      return {
        isValid: false,
        errors: errorMessages,
      };
    }

    return { isValid: true };
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Eliminar caracteres HTML
      .replace(/javascript:/gi, '') // Eliminar protocolos javascript
      .trim();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    // Mínimo 8 caracteres, al menos una letra mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }
} 