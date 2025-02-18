import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Register Use Case", () => {
  beforeEach( async() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Academia Frangolandia",
      description: " ",
      latitude: -3.7905855545846596,
      longitude: -38.50106334738821,
      phone: null,
    });


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
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
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

    await expect(() => sut.execute({
      gymId: "gym-02",
      userId: "user-01",
      userLatitude: -3.790606874878049,
      userLongitude: -38.501074594216846,
    })).rejects.toBeInstanceOf(MaxDistanceError)
  });
});
