const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function checkUsersAndRoutes() {
    console.log('🔍 Verificando usuarios y rutas en la base de datos...\n');

    try {
        // Verificar usuarios
        const users = await prisma.user.findMany({
            select: { 
                id: true, 
                email: true, 
                name: true,
                createdAt: true 
            }
        });
        
        console.log(`👥 Usuarios encontrados: ${users.length}`);
        if (users.length > 0) {
            console.log('--- Lista de usuarios ---');
            users.forEach(user => {
                console.log(`ID: ${user.id}, Email: ${user.email}, Name: ${user.name || 'Sin nombre'}`);
            });
        } else {
            console.log('❌ No hay usuarios en la base de datos');
        }

        // Verificar rutas
        const routes = await prisma.route.findMany({
            select: { 
                id: true, 
                code: true, 
                name: true,
                status: true 
            }
        });
        
        console.log(`\n🚌 Rutas encontradas: ${routes.length}`);
        if (routes.length > 0) {
            console.log('--- Lista de rutas ---');
            routes.forEach(route => {
                console.log(`ID: ${route.id}, Code: ${route.code}, Name: ${route.name}, Status: ${route.status}`);
            });
        }

        // Verificar favoritos existentes
        const favorites = await prisma.starredRoute.findMany({
            include: {
                users: { select: { email: true } },
                routes: { select: { code: true, name: true } }
            }
        });
        
        console.log(`\n⭐ Favoritos existentes: ${favorites.length}`);
        if (favorites.length > 0) {
            favorites.forEach(fav => {
                console.log(`Usuario: ${fav.users.email} → Ruta: ${fav.routes.code} (${fav.routes.name})`);
            });
        }

        return { users, routes };

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsersAndRoutes();
