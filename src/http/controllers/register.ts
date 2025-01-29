import { FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod";
import { RegisterUseCase } from '@/use-cases/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';



export async function register(request: FastifyRequest, reply: FastifyReply){
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const {name, email, password} = registerBodySchema.parse(request.body);

  try {
    const UsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository);

    await registerUseCase.execute({ name, email, password });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {

    if(err instanceof UserAlreadyExistsError){
      return reply.status(409).send({ message: err.message})

    }

    throw err
  }

  return reply.status(201).send();
}