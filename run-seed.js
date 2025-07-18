#!/usr/bin/env node

/**
 * Script para ejecutar el seed de la base de datos
 * 
 * Uso:
 * node run-seed.js
 * 
 * O desde npm:
 * npm run seed
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🌱 Iniciando proceso de seed...\n');

// Ejecutar el seed usando ts-node
const seedProcess = spawn('npx', ['ts-node', 'src/shared/seed/seed.ts'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

seedProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Seed completado exitosamente!');
    console.log('🎉 Tu base de datos ahora tiene datos de prueba listos para usar.');
    console.log('\n📝 Consulta el README.md en src/shared/seed/ para más información.');
  } else {
    console.error(`\n❌ Error: El proceso de seed falló con código ${code}`);
    console.log('\n🔧 Verifica que:');
    console.log('   - La base de datos esté corriendo');
    console.log('   - La variable DATABASE_URL esté configurada');
    console.log('   - Las migraciones estén aplicadas (npx prisma migrate dev)');
    process.exit(1);
  }
});

seedProcess.on('error', (error) => {
  console.error('\n❌ Error al ejecutar el seed:', error.message);
  process.exit(1);
});
