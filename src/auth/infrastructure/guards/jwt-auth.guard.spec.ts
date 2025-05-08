import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  const createMockContext = (request: any = {}) => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(request),
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }),
    }),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  } as unknown as ExecutionContext);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when route is public', () => {
      const mockContext = createMockContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when no token is provided', () => {
      const mockContext = createMockContext({
        headers: {},
      });

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token is invalid', () => {
      const mockContext = createMockContext({
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
    });
  });
}); 