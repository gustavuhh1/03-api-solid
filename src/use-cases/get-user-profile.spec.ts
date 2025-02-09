import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository";
import { hash } from "bcryptjs";
import { GetUserProfileUseUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Carlos",
      email: "johndoe2@example.com",
      password_hash: await hash("senha1234", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('John Carlos');
  });


  it("should not be able to get user profile with wrong id", async () => {

    await expect(() => 
      sut.execute({
        userId: 'non-existing-id'
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  });

});
