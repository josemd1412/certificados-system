import { google } from 'googleapis';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const KEYFILEPATH = path.join(__dirname, 'service-account.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// Autenticación con cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Cliente de Google Drive
export const drive = google.drive({
  version: 'v3',
  auth
});

console.log('✓ Google Drive API configurada correctamente');

export default drive;
