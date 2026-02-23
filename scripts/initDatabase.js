/**
 * Script de inicialización de la base de datos
 * Crea la libreta "general" por defecto para el usuario de prueba
 */

require('dotenv').config();
const { initializeFirebase, getFirestore } = require('../config/firebase');

const initDatabase = async () => {
  try {
    console.log('🚀 Iniciando configuración de base de datos...\n');

    // Initialize Firebase
    initializeFirebase();
    const db = getFirestore();

    const userId = process.env.TEST_USER_ID || 'test-user-123';
    console.log(`👤 Usuario de prueba: ${userId}\n`);

    // Create general notebook
    const generalNotebookRef = db
      .collection('users')
      .doc(userId)
      .collection('notebooks')
      .doc('general');

    const generalNotebook = await generalNotebookRef.get();

    if (!generalNotebook.exists) {
      await generalNotebookRef.set({
        name: 'Notas generales',
        createdAt: new Date().toISOString(),
        userId,
      });
      console.log('✅ Libreta "general" creada exitosamente');
    } else {
      console.log('ℹ️  La libreta "general" ya existe');
    }

    // Create a sample note (optional)
    const sampleNoteRef = db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc('sample-note');

    const sampleNote = await sampleNoteRef.get();

    if (!sampleNote.exists) {
      await sampleNoteRef.set({
        title: 'Bienvenido a Notes App',
        body: '<h1>¡Hola! 👋</h1><p>Esta es tu primera nota.</p><p>Puedes editarla, crear nuevas notas, organizarlas en libretas y mucho más.</p>',
        notebook: 'general',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
      });
      console.log('✅ Nota de bienvenida creada exitosamente');
    } else {
      console.log('ℹ️  La nota de bienvenida ya existe');
    }

    console.log('\n✨ Configuración completada exitosamente!\n');
    console.log('Puedes iniciar el servidor con: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

// Run the script
initDatabase();
