import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
    name:string
    email:string
    password:string
}

export class RegisterUseCase {

  constructor(private UsersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.UsersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error("User with same email already exists");
    }

    // const prismaUsersRepository = new PrismaUsersRepository();

    await this.UsersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
