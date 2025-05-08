import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  message: string;
  status: boolean;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // Si la respuesta ya tiene el formato deseado, la devolvemos tal cual
        if (data && typeof data === 'object' && 'data' in data && 'message' in data && 'status' in data) {
          return data;
        }

        // Si es una respuesta de error (que ya fue transformada por el filtro de excepciones)
        if (data && typeof data === 'object' && 'success' in data && data.success === false) {
          return {
            data: null,
            message: data.message,
            status: false
          };
        }

        // Para respuestas exitosas, transformamos al formato estándar
        return {
          data,
          message: 'Operación exitosa',
          status: true
        };
      }),
    );
  }
} 