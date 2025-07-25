const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFavorites() {
    console.log('🧪 Iniciando pruebas de favoritos...');

    try {
        // 1. Verificar usuarios existentes
        console.log('\n1. Verificando usuarios existentes...');
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true }
        });
        console.log(`✅ Usuarios encontrados: ${users.length}`);
        users.forEach(user => {
            console.log(`   - ID: ${user.id}, Email: ${user.email}, Name: ${user.name || 'Sin nombre'}`);
        });

        // 2. Verificar rutas existentes
        console.log('\n2. Verificando rutas existentes...');
        const routes = await prisma.route.findMany({
            select: { id: true, code: true, name: true }
        });
        console.log(`✅ Rutas encontradas: ${routes.length}`);
        routes.forEach(route => {
            console.log(`   - ID: ${route.id}, Code: ${route.code}, Name: ${route.name}`);
        });

        // 3. Verificar favoritos existentes
        console.log('\n3. Verificando favoritos existentes...');
        const favorites = await prisma.starredRoute.findMany({
            include: {
                user: { select: { email: true } },
                route: { select: { code: true, name: true } }
            }
        });
        console.log(`✅ Favoritos encontrados: ${favorites.length}`);
        favorites.forEach(fav => {
            console.log(`   - Usuario: ${fav.user.email} -> Ruta: ${fav.route.code} (${fav.route.name})`);
        });

        if (users.length > 0 && routes.length > 0) {
            const testUser = users[0];
            const testRoute = routes[0];
            
            console.log(`\n🧪 Probando con Usuario ID: ${testUser.id}, Ruta ID: ${testRoute.id}`);
            
            // 4. Hacer petición HTTP al endpoint
            const fetch = (await import('node-fetch')).default;
            
            const response = await fetch('http://localhost:7000/api/v1/public/starred-routes/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: testUser.id,
                    routeId: testRoute.id
                })
            });
            
            const result = await response.json();
            console.log('✅ Respuesta del endpoint:', result);
            
            if (result.success) {
                console.log(`✅ ¡Favorito ${result.data.action === 'added' ? 'agregado' : 'removido'} exitosamente!`);
                
                // 5. Verificar que se guardó
                const userFavorites = await fetch(`http://localhost:7000/api/v1/public/starred-routes/user/${testUser.id}`);
                const favoritesResult = await userFavorites.json();
                console.log('✅ Favoritos del usuario:', favoritesResult);
            }
        }

    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testFavorites();
