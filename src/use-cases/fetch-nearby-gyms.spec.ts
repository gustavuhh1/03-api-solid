import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Academia 16km",
      description: "Cagaram na cadeira do supino",
      phone: "",
      latitude: -3.7016516564376962,
      longitude: -38.58395024425787,
    });

    await gymsRepository.create({
      title: "Academia Gaviões",
      description: " ",
      latitude: -3.7912137240377835,
      longitude: -38.47981472778172,
      phone: null,
    });

    const { gyms } = await sut.execute({
      userLatiude: -3.790553397935345,
      userLongitude: -38.50101241525104,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Academia Gaviões" })]);
  });

});
