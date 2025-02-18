import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Fetch Check-ins History Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await gymsRepository.create({
      title: "Academia Taberna",
      description: "Cagaram na cadeira do supino",
      phone: "",
      latitude: -3.7904634349492157,
      longitude: -38.500742324104166,
    });

    await gymsRepository.create({
      id: "gym-01",
      title: "Academia Frangolandia",
      description: " ",
      latitude: -3.7905855545846596,
      longitude: -38.50106334738821,
      phone: null,
    });

    const { gym } = await sut.execute({
      query: "Taberna",
      page: 1
    });

    expect(gym).toHaveLength(1);
    expect(gym).toEqual([expect.objectContaining({ title: "Academia Taberna"})])

  });

  it("should be able to fetch paginated check-in history", async () => {
  
  
    for (let i = 1; i <= 22; i++){
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: " ",
        latitude: -3.7905855545846596,
        longitude: -38.50106334738821,
        phone: null,
      });
    }

    const { gym } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });
      
    expect(gym).toHaveLength(2);
    expect(gym).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  
  });

 
});
