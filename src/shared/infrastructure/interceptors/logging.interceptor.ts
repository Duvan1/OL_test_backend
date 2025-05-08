import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.logSuccess(method, url, ip, userAgent, startTime),
        error: (error) => this.logError(method, url, ip, userAgent, startTime, error),
      }),
    );
  }

  private logSuccess(method: string, url: string, ip: string, userAgent: string, startTime: number): void {
    const responseTime = Date.now() - startTime;
    this.logger.log(`${method} ${url} ${responseTime}ms - ${ip} - ${userAgent}`);
  }

  private logError(method: string, url: string, ip: string, userAgent: string, startTime: number, error: Error): void {
    const responseTime = Date.now() - startTime;
    this.logger.error(
      `${method} ${url} ${responseTime}ms - ${ip} - ${userAgent} - Error: ${error.message}`,
      error.stack,
    );
  }
} 