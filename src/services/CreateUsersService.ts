import { getRepository } from 'typeorm';
import User from '../models/Users';
import { hash } from 'bcryptjs';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}
class CreateUsersService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: {email},
    });

    if (checkUserExists){
      throw new AppError("Email Address already user.");
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUsersService;
