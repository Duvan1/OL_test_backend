import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { IMerchantRepository } from '@merchants/domain/repositories/merchant.repository.interface';
import { IMerchant } from '@merchants/domain/entities/merchant.entity';

@Injectable()
export class MerchantReportService {
  constructor(
    @Inject('IMerchantRepository')
    private readonly merchantRepository: IMerchantRepository
  ) {}

  async generateReport(): Promise<string> {
    console.log('Iniciando generación de reporte...');
    try {
      console.log('Consultando comerciantes activos...');
      const merchants = await this.merchantRepository.findAll();

      console.log(`Comerciantes encontrados: ${merchants?.length || 0}`);

      if (!merchants || merchants.length === 0) {
        console.log('No se encontraron comerciantes activos');
        return 'No hay comerciantes activos para generar el reporte';
      }

      const headers = [
        'Nombre o razón social',
        'Municipio',
        'Teléfono',
        'Correo Electrónico',
        'Fecha de Registro',
        'Estado',
        'Cantidad de Establecimientos',
        'Total Ingresos',
        'Cantidad de Empleados'
      ].join('|');

      console.log('Procesando datos de comerciantes...');
      const rows = merchants.map((merchant: IMerchant) => {
        try {
          if (!merchant) {
            console.error('Comerciante nulo encontrado');
            return null;
          }

          console.log(`Procesando comerciante ID: ${merchant.id}, Nombre: ${merchant.name}`);
          console.log(`Establecimientos del comerciante: ${merchant.establishments?.length || 0}`);

          const totalRevenue = merchant.establishments?.reduce((sum, est) => {
            const revenue = Number(est?.revenue) || 0;
            console.log(`Ingresos del establecimiento ${est?.id}: ${revenue}`);
            return sum + revenue;
          }, 0) || 0;

          const totalEmployees = merchant.establishments?.reduce((sum, est) => {
            const employees = Number(est?.employee_count) || 0;
            console.log(`Empleados del establecimiento ${est?.id}: ${employees}`);
            return sum + employees;
          }, 0) || 0;

          const municipality = merchant.establishments?.[0]?.municipality?.name || 'N/A';
          console.log(`Municipio del comerciante: ${municipality}`);

          const row = [
            merchant.name || 'N/A',
            municipality,
            merchant.phone || 'N/A',
            merchant.email || 'N/A',
            merchant.created_at ? merchant.created_at.toISOString().split('T')[0] : 'N/A',
            merchant.status || 'N/A',
            merchant.establishments?.length || 0,
            totalRevenue.toFixed(2),
            totalEmployees
          ].join('|');

          console.log(`Fila generada para comerciante ${merchant.id}: ${row}`);
          return row;
        } catch (error) {
          console.error(`Error procesando comerciante ${merchant?.id}:`, error);
          console.error('Detalles del error:', {
            merchantId: merchant?.id,
            merchantName: merchant?.name,
            error: error instanceof Error ? error.message : 'Error desconocido',
            stack: error instanceof Error ? error.stack : undefined
          });
          return null;
        }
      }).filter(row => row !== null);

      console.log(`Filas procesadas exitosamente: ${rows.length}`);

      if (rows.length === 0) {
        console.log('No se pudieron procesar datos de comerciantes');
        return 'Error al procesar los datos de los comerciantes';
      }

      const report = [headers, ...rows].join('\n');
      console.log('Reporte generado exitosamente');
      return report;
    } catch (error) {
      console.error('Error generando reporte:', error);
      console.error('Detalles del error:', {
        name: error instanceof Error ? error.name : 'Error desconocido',
        message: error instanceof Error ? error.message : 'Sin mensaje',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error al generar el reporte: ${error.message}`);
      }
      throw new InternalServerErrorException('Error al generar el reporte de comerciantes');
    }
  }
} 