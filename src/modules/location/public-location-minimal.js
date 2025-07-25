const express = require('express');

const router = express.Router();

console.log('🔧 [PUBLIC-LOCATION] Configurando router con rutas POST y GET...');

// Endpoint para recibir y procesar la ubicación del usuario
router.post('/current', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        
        console.log(`📍 [PUBLIC-LOCATION] POST request recibido con body:`, req.body);
        
        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Se requieren las coordenadas latitude y longitude"
            });
        }

        console.log(`📍 [PUBLIC-LOCATION] Procesando ubicación: ${latitude}, ${longitude}`);
        
        // Aquí podrías usar un servicio de geocodificación inversa para obtener la dirección
        // Por ahora, retornamos la ubicación con datos básicos
        const userLocation = {
            id: Date.now(),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address: `Ubicación real: ${latitude}, ${longitude}`,
            city: "Huauchinango",
            country: "México",
            timestamp: new Date().toISOString(),
            isRealLocation: true
        };
        
        console.log(`✅ [PUBLIC-LOCATION] Ubicación real procesada: ${userLocation.address}`);
        
        res.status(200).json({
            success: true,
            message: "Ubicación real procesada exitosamente",
            data: userLocation
        });
    } catch (error) {
        console.error('❌ [PUBLIC-LOCATION] Error al procesar ubicación:', error);
        res.status(500).json({
            success: false,
            message: "Error al procesar la ubicación",
            error: error.message || 'Error desconocido'
        });
    }
});

// Endpoint GET para compatibilidad (retorna ubicación por defecto)
router.get('/current', async (req, res) => {
    try {
        console.log('📍 [PUBLIC-LOCATION] Solicitud GET - retornando ubicación por defecto...');
        
        // Ubicación por defecto para desarrollo
        const defaultLocation = {
            id: 1,
            latitude: 10.4806,
            longitude: -66.9036,
            address: "Centro de Caracas, Distrito Capital, Venezuela",
            city: "Caracas",
            country: "Venezuela",
            timestamp: new Date().toISOString(),
            note: "Ubicación por defecto - Use POST /current con coordenadas para ubicación real"
        };
        
        console.log(`✅ [PUBLIC-LOCATION] Ubicación por defecto enviada`);
        
        res.status(200).json({
            success: true,
            message: "Ubicación por defecto obtenida",
            data: defaultLocation
        });
    } catch (error) {
        console.error('❌ [PUBLIC-LOCATION] Error al obtener ubicación por defecto:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener la ubicación",
            error: error.message || 'Error desconocido'
        });
    }
});

console.log('✅ [PUBLIC-LOCATION] Router configurado con rutas:');
console.log('   📍 POST /current - Para recibir ubicación real del usuario');
console.log('   📍 GET /current - Para ubicación por defecto');

module.exports = router;
