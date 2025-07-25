import express, { Request, Response } from 'express';

const router = express.Router();

// Endpoint para obtener ubicación actual (simulada)
router.get('/current', async (req: Request, res: Response) => {
    try {
        // Simulamos la ubicación de Huauchinango, Puebla
        const location = {
            latitude: 20.1833,
            longitude: -98.0500,
            address: "Centro, Huauchinango, Puebla, México",
            city: "Huauchinango",
            state: "Puebla",
            country: "México",
            postalCode: "73160"
        };

        res.status(200).json({
            success: true,
            message: "Ubicación obtenida exitosamente",
            data: location
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la ubicación",
            error: error.message
        });
    }
});

export default router;
