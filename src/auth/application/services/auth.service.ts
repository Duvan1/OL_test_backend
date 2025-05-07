import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '@users/domain/repositories/user.repository.interface';
import { LoginDto } from '@auth/application/dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => 'IUserRepository'))
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    // Verificar si la contraseña está hasheada o en texto plano
    const isPasswordValid = user.password.startsWith('$2') 
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (isPasswordValid) {
      // Si la contraseña está en texto plano, la hasheamos y actualizamos
      if (!user.password.startsWith('$2')) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        await this.userRepository.update(user.id, { password: hashedPassword });
      }

      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
} 