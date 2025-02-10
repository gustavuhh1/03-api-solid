import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-01",
      title: "Academia Frangolandia",
      description: " ",
      latitude: new Decimal(-3.7905855545846596),
      longitude: new Decimal(-38.50106334738821),
      phone: null,
    });
    //-3.7905855545846596, -38.50106334738821
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check in", async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.7905855545846596,
      userLongitude: -38.50106334738821,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -3.7905855545846596,
      userLongitude: -38.50106334738821,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -3.7905855545846596,
        userLongitude: -38.50106334738821,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -3.7905855545846596,
      userLongitude: -38.50106334738821,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -3.7905855545846596,
      userLongitude: -38.50106334738821,
    });

    expect(checkIn.id).toEqual(expect.any(String))
  });

  it("should not be able to check in on distance gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Academia Frangolandia",
      description: " ",
      latitude: new Decimal(-3.791213928724899),
      longitude: new Decimal(-38.4802377327178),
      phone: null,
    });

    // -3.791213928724899, -38.4802377327178
    //-3.790606874878049, -38.501074594216846

    await expect(() => sut.execute({
      gymId: "gym-02",
      userId: "user-01",
      userLatitude: -3.790606874878049,
      userLongitude: -38.501074594216846,
    })).rejects.toBeInstanceOf(Error)
  });
});
