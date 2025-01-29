import { Prisma, User } from "@prisma/client";

export interface UsersRepository {

    findByEmail(email:string): Promise<UserUser | null>

    create(data: Prisma.UserCreateInput): Promise<User>
}