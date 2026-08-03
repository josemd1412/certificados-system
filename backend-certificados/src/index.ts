import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import certificadoRoutes from './routes/certificadoRoutes';
import cursoRoutes from './routes/cursoRoutes';
import errorHandler from './middlewares/errorHandler';

// Cargar variables de entorno
dotenv.config();

// Inicializar base de datos y Google Drive
import './config/database';
import './config/googleDrive';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Certificados - Documentación'
}));

// Ruta para obtener el JSON de Swagger
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API de Certificados - Sistema de Gestión',
    documentation: '/api-docs'
  });
});

app.use('/api/certificados', certificadoRoutes);
app.use('/api/cursos', cursoRoutes);

// Middleware de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`\n📝 Endpoints de Certificados:`);
  console.log(`   GET    /api/certificados`);
  console.log(`   GET    /api/certificados/buscar`);
  console.log(`   GET    /api/certificados/:codigo`);
  console.log(`   GET    /api/certificados/masivo`);
  console.log(`   POST   /api/certificados`);
  console.log(`   GET    /api/certificados/drive/:fileId`);
  console.log(`\n📚 Endpoints de Cursos:`);
  console.log(`   GET    /api/cursos`);
  console.log(`   GET    /api/cursos/:id`);
  console.log(`   GET    /api/cursos/:id/certificados`);
  console.log(`   GET    /api/cursos/:id/estadisticas`);
  console.log(`   POST   /api/cursos`);
  console.log(`   PUT    /api/cursos/:id`);
  console.log(`   DELETE /api/cursos/:id`);
  console.log(`   POST   /api/cursos/:id/certificados/masivo\n`);
});

export default app;
