import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para ejecutar el seed mejorado con las nuevas relaciones
 */
async function runEnhancedSeed() {
  console.log('🚀 Iniciando ejecución del seed mejorado...\n');
  
  try {
    // Verificar que el archivo de seed existe
    const seedPath = path.join(__dirname, 'enhanced-seed.ts');
    if (!fs.existsSync(seedPath)) {
      throw new Error('Archivo enhanced-seed.ts no encontrado');
    }

    // Compilar y ejecutar el seed
    console.log('📦 Compilando TypeScript...');
    execSync('npx tsc src/shared/seed/enhanced-seed.ts --outDir dist --target ES2020 --module commonjs --esModuleInterop', {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    console.log('🌱 Ejecutando seed mejorado...');
    execSync('node dist/src/shared/seed/enhanced-seed.js', {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    console.log('\n✅ Seed mejorado ejecutado exitosamente!');
    console.log('🎯 Las nuevas relaciones Driver-User han sido establecidas correctamente.');
    
  } catch (error) {
    console.error('\n❌ Error ejecutando el seed mejorado:', error);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  runEnhancedSeed();
}

export { runEnhancedSeed };
