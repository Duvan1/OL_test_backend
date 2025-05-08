import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sistema')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificar estado del sistema' })
  @ApiResponse({
    status: 200,
    description: 'Sistema funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-03-08T04:02:48.985Z' },
        uptime: { type: 'number', example: 1234567 },
        database: { type: 'string', example: 'connected' }
      }
    }
  })
  @ApiResponse({
    status: 503,
    description: 'Sistema con problemas',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        timestamp: { type: 'string', example: '2024-03-08T04:02:48.985Z' },
        uptime: { type: 'number', example: 1234567 },
        database: { type: 'string', example: 'disconnected' }
      }
    }
  })
  async getHealth() {
    const dbStatus = await this.appService.checkDatabaseConnection();
    
    return {
      status: dbStatus ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus ? 'connected' : 'disconnected'
    };
  }
}
