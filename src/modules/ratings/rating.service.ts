import { Rating } from "../../../generated/prisma";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { RatingRepositoryInterface } from "./interfaces/RatingRepository.interface";
import { RatingServiceInterface } from "./interfaces/RatingService.interface";

export class RatingService implements RatingServiceInterface {
    constructor(
        private readonly ratingRepository: RatingRepositoryInterface
    ) { }

    async findAllRatings(): Promise<Rating[]> {
        return this.ratingRepository.findAll();
    }

    async findRatingById(id: number): Promise<Rating> {
        return this.ratingRepository.findById(id);
    }

    async createRating(ratingData: CreateRatingDto): Promise<Rating> {
        return this.ratingRepository.createRating(ratingData);
    }

    async updateRating(id: number, ratingData: UpdateRatingDto): Promise<Rating> {
        return this.ratingRepository.updateRating(id, ratingData);
    }

    async deleteRating(id: number): Promise<void> {
        return this.ratingRepository.deleteRating(id);
    }
}