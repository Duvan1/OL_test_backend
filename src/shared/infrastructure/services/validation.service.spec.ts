import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

class TestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationService],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAndSanitize', () => {
    it('should return isValid true for valid data', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = await service.validateAndSanitize(dto, TestDto);
      expect(result.isValid).toBe(true);
    });

    it('should return isValid false with errors for invalid data', async () => {
      const dto = {
        email: 'invalid-email',
        password: 'short',
      };

      const result = await service.validateAndSanitize(dto, TestDto);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("test")</script>';
      const result = service.sanitizeInput(input);
      expect(result).toBe('scriptalert("test")/script');
    });

    it('should remove javascript protocol', () => {
      const input = 'javascript:alert("test")';
      const result = service.sanitizeInput(input);
      expect(result).toBe('alert("test")');
    });

    it('should trim whitespace', () => {
      const input = '  test  ';
      const result = service.sanitizeInput(input);
      expect(result).toBe('test');
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(service.validateEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(service.validateEmail('invalid-email')).toBe(false);
      expect(service.validateEmail('test@')).toBe(false);
      expect(service.validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', () => {
      expect(service.validatePassword('Password123')).toBe(true);
    });

    it('should return false for invalid password', () => {
      expect(service.validatePassword('short')).toBe(false);
      expect(service.validatePassword('password123')).toBe(false);
      expect(service.validatePassword('PASSWORD123')).toBe(false);
      expect(service.validatePassword('Password')).toBe(false);
    });
  });
}); 