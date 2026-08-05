import { google } from 'googleapis';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Función para obtener credenciales
function getCredentials() {
  // Producción: usar variable de entorno base64
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    try {
      const jsonString = Buffer.from(
        process.env.GOOGLE_SERVICE_ACCOUNT_BASE64,
        'base64'
      ).toString();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error al decodificar credenciales de Google Drive:', error);
      throw new Error('Credenciales de Google Drive inválidas');
    }
  }

  // Desarrollo: usar archivo local
  if (process.env.NODE_ENV === 'development') {
    const KEYFILEPATH = path.join(__dirname, 'service-account.json');
    return require(KEYFILEPATH);
  }

  throw new Error('No se encontraron credenciales de Google Drive. Configure GOOGLE_SERVICE_ACCOUNT_BASE64.');
}

// Autenticación con cuenta de servicio
const auth = new google.auth.GoogleAuth({
  credentials: getCredentials(),
  scopes: SCOPES,
});

// Cliente de Google Drive
export const drive = google.drive({
  version: 'v3',
  auth
});

console.log('✓ Google Drive API configurada correctamente');

export default drive;
