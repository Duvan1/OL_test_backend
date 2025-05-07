import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class MunicipalitiesService {
  private readonly CACHE_KEY = 'municipalities';
  private readonly CACHE_TTL = 3600; // 1 hora en segundos

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<{ id: number; name: string }[]> {
    // Intentar obtener del caché
    const cachedMunicipalities = await this.cacheManager.get<{ id: number; name: string }[]>(this.CACHE_KEY);
    if (cachedMunicipalities) {
      return cachedMunicipalities;
    }

    // Si no está en caché, obtener de la base de datos
    const municipalities = await this.prisma.municipality.findMany({
      select: { 
        id: true,
        name: true 
      },
      orderBy: { name: 'asc' },
    });

    // Guardar en caché
    await this.cacheManager.set(this.CACHE_KEY, municipalities, this.CACHE_TTL);

    return municipalities;
  }
} 