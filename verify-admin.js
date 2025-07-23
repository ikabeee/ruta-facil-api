const { PrismaClient } = require('./generated/prisma');

async function verifyAdminUser() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔍 Buscando usuario admin...');
        
        // Buscar usuario admin por email
        const adminUser = await prisma.user.findUnique({
            where: {
                email: 'carlglz30@gmail.com'
            }
        });
        
        if (!adminUser) {
            console.log('❌ Usuario admin no encontrado');
            return;
        }
        
        console.log('📋 Usuario encontrado:');
        console.log('- ID:', adminUser.id);
        console.log('- Name:', adminUser.name);
        console.log('- Email:', adminUser.email);
        console.log('- Role:', adminUser.role);
        console.log('- Email Verified:', adminUser.emailVerified);
        console.log('- Status:', adminUser.status);
        
        if (!adminUser.emailVerified) {
            console.log('🔧 Actualizando usuario para verificar email...');
            
            const updatedUser = await prisma.user.update({
                where: {
                    id: adminUser.id
                },
                data: {
                    emailVerified: true,
                    status: 'ACTIVE',
                    updatedAt: new Date()
                }
            });
            
            console.log('✅ Usuario admin verificado exitosamente:');
            console.log('- Email Verified:', updatedUser.emailVerified);
            console.log('- Status:', updatedUser.status);
        } else {
            console.log('✅ El usuario admin ya está verificado');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAdminUser();
