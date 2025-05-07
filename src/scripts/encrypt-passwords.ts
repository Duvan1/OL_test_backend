import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@users/domain/entities/user.entity';

async function encryptPasswords() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'OL',
    entities: [User],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.find();

    console.log(`Encontrados ${users.length} usuarios para actualizar`);

    for (const user of users) {
      if (!user.password.startsWith('$2')) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        await userRepository.update(user.id, { password: hashedPassword });
        console.log(`Contraseña actualizada para el usuario: ${user.email}`);
      } else {
        console.log(`El usuario ${user.email} ya tiene la contraseña encriptada`);
      }
    }

    console.log('Proceso de encriptación completado');
  } catch (error) {
    console.error('Error durante el proceso de encriptación:', error);
  } finally {
    await dataSource.destroy();
    console.log('Conexión a la base de datos cerrada');
  }
}

encryptPasswords(); 