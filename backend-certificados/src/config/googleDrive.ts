import { google } from 'googleapis';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Función para obtener credenciales del service account
function getServiceAccountCredentials() {
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

// Los service accounts no tienen cuota de almacenamiento propia y no pueden
// subir archivos con contenido (solo crear carpetas) salvo que se use un
// Shared Drive, que requiere Google Workspace. Con una cuenta de Gmail
// personal, la única forma de que los archivos cuenten contra su cuota es
// autenticar vía OAuth2 delegando en esa cuenta (ver scripts/generar-refresh-token.js).
function buildAuth() {
  if (process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
    return oauth2Client;
  }

  return new google.auth.GoogleAuth({
    credentials: getServiceAccountCredentials(),
    scopes: SCOPES,
  });
}

// Cliente de Google Drive
export const drive = google.drive({
  version: 'v3',
  auth: buildAuth()
});

console.log(
  `✓ Google Drive API configurada correctamente (${
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN ? 'OAuth2 - cuenta personal' : 'Service Account'
  })`
);

export default drive;
