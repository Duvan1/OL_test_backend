import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  public readonly rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 peticiones por ventana
    message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde',
    standardHeaders: true,
    legacyHeaders: false,
  };

  private readonly limiter: any;

  constructor(private readonly configService: ConfigService) {
    this.limiter = rateLimit(this.rateLimitConfig);
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Aplicar rate limiting
    this.limiter(req, res, (err: any) => {
      if (err) {
        return next(err);
      }
      next();
    });

    // Aplicar helmet
    helmet()(req, res, next);

    // Configurar headers de seguridad
    this.setSecurityHeaders(res);
  }

  private setSecurityHeaders(res: Response) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
  }
} 