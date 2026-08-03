import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Certificados',
      version: '1.0.0',
      description: 'Sistema de gestión y consulta de certificados almacenados en Google Drive',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'soporte@certificados.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://tu-backend.railway.app',
        description: 'Servidor de producción'
      }
    ],
    tags: [
      {
        name: 'Cursos',
        description: 'Endpoints para gestionar cursos y carga masiva de certificados'
      },
      {
        name: 'Certificados',
        description: 'Endpoints para gestionar certificados individuales'
      },
      {
        name: 'Google Drive',
        description: 'Endpoints para interactuar con Google Drive'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
