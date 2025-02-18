import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymsUseCaseRequest {
    query:string
    page: number
}

interface SearchGymsUseCaseResponse{
  gym: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    
    const gym = await this.gymsRepository.searchMany(query,page);

    return {gym}
  }
}
