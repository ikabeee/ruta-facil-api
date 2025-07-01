import express, { Request, Response } from 'express';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingRepository } from './rating.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const ratingRepository = new RatingRepository(prisma);
const ratingService = new RatingService(ratingRepository);
const ratingController = new RatingController(ratingService);
const router = express.Router();

router.get('/', async (req: Request, res: Response) => { await ratingController.findAllRatings(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await ratingController.findRatingById(req, res); });
router.post('/create', async (req: Request, res: Response) => { await ratingController.createRating(req, res); });
router.put('/update/:id', async (req: Request, res: Response) => { await ratingController.updateRating(req, res); });
router.delete('/delete/:id', async (req: Request, res: Response) => { await ratingController.deleteRating(req, res); });

export default router;