const WebSocket = require('ws');

console.log('🔌 [WEBSOCKET-TRACKER] Configurando servidor WebSocket para seguimiento...');

class RouteTracker {
    constructor() {
        this.clients = new Map(); // routeId -> Set of WebSocket clients
        this.vehicles = new Map(); // routeId -> Array of vehicles
        this.updateInterval = null;
        this.isRunning = false;
    }

    startTracking(server) {
        // Crear servidor WebSocket
        this.wss = new WebSocket.Server({ 
            server,
            path: '/ws/route-tracking'
        });

        console.log('🔌 [WEBSOCKET-TRACKER] Servidor WebSocket iniciado en /ws/route-tracking');

        this.wss.on('connection', (ws, req) => {
            console.log('🔗 [WEBSOCKET-TRACKER] Nueva conexión WebSocket establecida');

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleMessage(ws, data);
                } catch (error) {
                    console.error('❌ [WEBSOCKET-TRACKER] Error procesando mensaje:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Formato de mensaje inválido'
                    }));
                }
            });

            ws.on('close', () => {
                console.log('🔌 [WEBSOCKET-TRACKER] Conexión WebSocket cerrada');
                this.removeClient(ws);
            });

            ws.on('error', (error) => {
                console.error('❌ [WEBSOCKET-TRACKER] Error en WebSocket:', error);
                this.removeClient(ws);
            });

            // Enviar mensaje de bienvenida
            ws.send(JSON.stringify({
                type: 'welcome',
                message: 'Conectado al seguimiento de rutas en tiempo real',
                timestamp: new Date().toISOString()
            }));
        });

        // Iniciar actualizaciones automáticas
        this.startVehicleUpdates();
        this.isRunning = true;
        console.log('✅ [WEBSOCKET-TRACKER] Sistema de seguimiento iniciado');
    }

    handleMessage(ws, data) {
        console.log(`📨 [WEBSOCKET-TRACKER] Mensaje recibido:`, data);

        switch (data.type) {
            case 'subscribe':
                this.subscribeToRoute(ws, data.routeId);
                break;
            case 'unsubscribe':
                this.unsubscribeFromRoute(ws, data.routeId);
                break;
            case 'get_vehicles':
                this.sendVehiclePositions(ws, data.routeId);
                break;
            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    message: `Tipo de mensaje desconocido: ${data.type}`
                }));
        }
    }

    subscribeToRoute(ws, routeId) {
        if (!routeId) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'ID de ruta requerido para suscripción'
            }));
            return;
        }

        // Agregar cliente a la ruta
        if (!this.clients.has(routeId)) {
            this.clients.set(routeId, new Set());
        }
        this.clients.get(routeId).add(ws);

        // Marcar la ruta en el WebSocket
        ws.subscribedRoutes = ws.subscribedRoutes || new Set();
        ws.subscribedRoutes.add(routeId);

        console.log(`📍 [WEBSOCKET-TRACKER] Cliente suscrito a ruta ${routeId}`);

        // Enviar posiciones actuales inmediatamente
        this.sendVehiclePositions(ws, routeId);

        ws.send(JSON.stringify({
            type: 'subscribed',
            routeId: routeId,
            message: `Suscrito al seguimiento de la ruta ${routeId}`,
            timestamp: new Date().toISOString()
        }));
    }

    unsubscribeFromRoute(ws, routeId) {
        if (this.clients.has(routeId)) {
            this.clients.get(routeId).delete(ws);
            if (this.clients.get(routeId).size === 0) {
                this.clients.delete(routeId);
            }
        }

        if (ws.subscribedRoutes) {
            ws.subscribedRoutes.delete(routeId);
        }

        console.log(`📍 [WEBSOCKET-TRACKER] Cliente desuscrito de ruta ${routeId}`);

        ws.send(JSON.stringify({
            type: 'unsubscribed',
            routeId: routeId,
            message: `Desuscrito del seguimiento de la ruta ${routeId}`,
            timestamp: new Date().toISOString()
        }));
    }

    removeClient(ws) {
        // Remover cliente de todas las rutas suscritas
        if (ws.subscribedRoutes) {
            ws.subscribedRoutes.forEach(routeId => {
                if (this.clients.has(routeId)) {
                    this.clients.get(routeId).delete(ws);
                    if (this.clients.get(routeId).size === 0) {
                        this.clients.delete(routeId);
                    }
                }
            });
        }
    }

    sendVehiclePositions(ws, routeId) {
        // Generar posiciones simuladas de vehículos
        const vehicles = this.generateVehicleData(routeId);
        
        ws.send(JSON.stringify({
            type: 'vehicle_positions',
            routeId: routeId,
            vehicles: vehicles,
            timestamp: new Date().toISOString()
        }));
    }

    startVehicleUpdates() {
        // Actualizar posiciones cada 5 segundos
        this.updateInterval = setInterval(() => {
            this.broadcastVehicleUpdates();
        }, 5000);

        console.log('🔄 [WEBSOCKET-TRACKER] Actualizaciones automáticas iniciadas (cada 5 segundos)');
    }

    broadcastVehicleUpdates() {
        // Enviar actualizaciones a todos los clientes suscritos
        this.clients.forEach((clientSet, routeId) => {
            if (clientSet.size > 0) {
                const vehicles = this.generateVehicleData(routeId);
                const message = JSON.stringify({
                    type: 'vehicle_update',
                    routeId: routeId,
                    vehicles: vehicles,
                    timestamp: new Date().toISOString()
                });

                clientSet.forEach(ws => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(message);
                    }
                });

                console.log(`🚐 [WEBSOCKET-TRACKER] Actualización enviada a ${clientSet.size} clientes de ruta ${routeId}`);
            }
        });
    }

    generateVehicleData(routeId) {
        // Coordenadas base para Huauchinango (centro)
        const baseCoords = {
            latitude: 20.1743,
            longitude: -98.0474
        };

        // Generar 2-4 vehículos simulados para la ruta
        const vehicleCount = Math.floor(Math.random() * 3) + 2;
        const vehicles = [];

        for (let i = 0; i < vehicleCount; i++) {
            // Variar posición alrededor del centro
            const latOffset = (Math.random() - 0.5) * 0.02; // ~2km radio
            const lngOffset = (Math.random() - 0.5) * 0.02;

            const vehicle = {
                id: `HUA-${routeId}-V${i + 1}`,
                unitNumber: `Unidad ${100 + parseInt(routeId) * 10 + i}`,
                latitude: baseCoords.latitude + latOffset,
                longitude: baseCoords.longitude + lngOffset,
                heading: Math.floor(Math.random() * 360),
                speed: Math.floor(Math.random() * 25) + 15, // 15-40 km/h
                passengers: Math.floor(Math.random() * 35) + 5,
                capacity: 40,
                status: Math.random() > 0.1 ? 'active' : 'stopped',
                lastUpdate: new Date().toISOString(),
                routeProgress: Math.floor(Math.random() * 100),
                nextStopETA: Math.floor(Math.random() * 15) + 2, // 2-17 minutos
                fuel: Math.floor(Math.random() * 40) + 60, // 60-100%
                driverName: `Conductor ${i + 1}`
            };

            vehicles.push(vehicle);
        }

        return vehicles;
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        if (this.wss) {
            this.wss.close();
        }

        this.clients.clear();
        this.vehicles.clear();
        this.isRunning = false;

        console.log('🛑 [WEBSOCKET-TRACKER] Sistema de seguimiento detenido');
    }

    getStats() {
        const totalClients = Array.from(this.clients.values())
            .reduce((sum, clientSet) => sum + clientSet.size, 0);

        return {
            isRunning: this.isRunning,
            totalRoutes: this.clients.size,
            totalClients: totalClients,
            routeStats: Array.from(this.clients.entries()).map(([routeId, clientSet]) => ({
                routeId,
                clients: clientSet.size
            }))
        };
    }
}

// Instancia global del tracker
const routeTracker = new RouteTracker();

module.exports = {
    RouteTracker,
    routeTracker
};

console.log('✅ [WEBSOCKET-TRACKER] Módulo de seguimiento configurado');
console.log('   🔌 WebSocket: /ws/route-tracking');
console.log('   📋 Comandos disponibles:');
console.log('     - subscribe: { "type": "subscribe", "routeId": "1" }');
console.log('     - unsubscribe: { "type": "unsubscribe", "routeId": "1" }');
console.log('     - get_vehicles: { "type": "get_vehicles", "routeId": "1" }');
