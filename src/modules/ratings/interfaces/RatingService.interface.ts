import { Rating } from "../../../../generated/prisma";
import { CreateRatingDto } from "../dto/create-rating.dto";
import { UpdateRatingDto } from "../dto/update-rating.dto";

export interface RatingServiceInterface {
    findAllRatings(): Promise<Rating[]>;
    findRatingById(id: number): Promise<Rating>;
    createRating(ratingData: CreateRatingDto): Promise<Rating>;
    updateRating(id: number, ratingData: UpdateRatingDto): Promise<Rating>;
    deleteRating(id: number): Promise<void>;
}
