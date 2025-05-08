import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let guard: RolesGuard;
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
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      const mockContext = createMockContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      const mockContext = createMockContext({
        user: {
          role: 'Administrador',
        },
      });

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['Administrador']);

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      const mockContext = createMockContext({
        user: {
          role: 'Auxiliar de Registro',
        },
      });

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['Administrador']);

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const mockContext = createMockContext({});

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['Administrador']);

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });
  });
}); 