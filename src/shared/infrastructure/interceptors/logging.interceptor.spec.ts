import { Test, TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockLogger: { log: jest.Mock; error: jest.Mock };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        method: 'GET',
        url: '/test',
        ip: '127.0.0.1',
        get: (header: string) => 'Mozilla/5.0',
      }),
    }),
  } as ExecutionContext;

  const mockCallHandler = {
    handle: () => of({ data: 'test' }),
  } as CallHandler;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LoggingInterceptor,
          useFactory: () => {
            const interceptor = new LoggingInterceptor();
            (interceptor as any).logger = mockLogger;
            return interceptor;
          },
        },
      ],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log successful request', async () => {
    await new Promise<void>((resolve) => {
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          expect(mockLogger.log).toHaveBeenCalled();
          resolve();
        },
      });
    });
  });

  it('should log error request', async () => {
    const error = new Error('Test error');
    const errorHandler = {
      handle: () => throwError(() => error),
    } as CallHandler;

    await new Promise<void>((resolve) => {
      interceptor.intercept(mockExecutionContext, errorHandler).subscribe({
        error: () => {
          expect(mockLogger.error).toHaveBeenCalled();
          resolve();
        },
      });
    });
  });

  it('should include request details in logs', async () => {
    await new Promise<void>((resolve) => {
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          const logCall = mockLogger.log.mock.calls[0][0];
          expect(logCall).toContain('GET');
          expect(logCall).toContain('/test');
          expect(logCall).toContain('127.0.0.1');
          expect(logCall).toContain('Mozilla/5.0');
          resolve();
        },
      });
    });
  });
}); 