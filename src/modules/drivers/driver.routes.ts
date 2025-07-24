import { Router } from 'express';
import { DriverController } from './driver.controller';
import { authMiddleware, adminMiddleware, driverMiddleware, ownerMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const driverController = new DriverController();

// Rutas protegidas por autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/drivers:
 *   get:
 *     summary: Obtener todos los drivers
 *     tags: [Drivers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de drivers obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', ownerMiddleware, async (req, res) => {
    await driverController.getAllDrivers(req, res);
});

/**
 * @swagger
 * /api/v1/drivers/stats:
 *   get:
 *     summary: Obtener estadísticas de drivers
 *     tags: [Drivers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/stats', ownerMiddleware, async (req, res) => {
    await driverController.getDriverStats(req, res);
});

/**
 * @swagger
 * /api/v1/drivers/stats:
 *   get:
 *     summary: Obtener estadísticas de drivers
 *     tags: [Drivers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/stats', adminMiddleware, async (req, res) => {
    await driverController.getDriverStats(req, res);
});

/**
 * @swagger
 * /api/v1/drivers/{id}:
 *   get:
 *     summary: Obtener driver por ID
 *     tags: [Drivers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Driver obtenido exitosamente
 *       404:
 *         description: Driver no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', ownerMiddleware, async (req, res) => {
    await driverController.getDriverById(req, res);
});

/**
 * @swagger
 * /api/v1/drivers/user/{userId}:
 *   get:
 *     summary: Obtener driver por User ID
 *     tags: [Drivers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Driver obtenido exitosamente
 *       404:
 *         description: Driver no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/user/:userId', ownerMiddleware, async (req, res) => {
    await driverController.getDriverByUserId(req, res);
});

/**
 * @swagger
 * /api/v1/drivers/create:
 *   post:
 *     summary: Crear nuevo driver
 *     tags: [Drivers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Driver creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/create', ownerMiddleware, async (req, res) => {
    await driverController.createDriver(req, res);
});

/**
 * @swagger
 * /api/v1/drivers/update/{id}:
 *   put:
 *     summary: Actualizar driver
 *     tags: [Drivers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Driver actualizado exitosamente
 *       404:
 *         description: Driver no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/update/:id', ownerMiddleware, async (req, res) => {
    await driverController.updateDriver(req, res);
});

/**
 * @swagger
 * /api/v1/drivers/delete/{id}:
 *   delete:
 *     summary: Eliminar driver
 *     tags: [Drivers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Driver eliminado exitosamente
 *       404:
 *         description: Driver no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/delete/:id', ownerMiddleware, async (req, res) => {
    await driverController.deleteDriver(req, res);
});

export default router;
