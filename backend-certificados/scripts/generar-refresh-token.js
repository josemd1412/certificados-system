#!/usr/bin/env node
/**
 * Genera un refresh token de OAuth2 para subir archivos a Drive usando tu
 * cuenta personal de Gmail (necesario porque los service accounts no tienen
 * cuota de almacenamiento propia y no pueden subir archivos con contenido).
 *
 * Requisito previo: crea un OAuth Client ID tipo "Desktop app" en
 * Google Cloud Console > APIs & Services > Credentials (mismo proyecto
 * donde está el service account, ej. backend-certificados-drive).
 *
 * Uso:
 *   node scripts/generar-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>
 *
 * Abre la URL que imprime, inicia sesión con la cuenta de Google Drive
 * personal donde está la carpeta certificados_por_curso/, y acepta los
 * permisos. El script imprime las 3 variables que debes copiar en Render.
 */
const http = require('http');
const { URL } = require('url');
const { google } = require('googleapis');

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error('Uso: node scripts/generar-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>');
  process.exit(1);
}

const PORT = 53682;
const redirectUri = `http://localhost:${PORT}/oauth2callback`;
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/drive']
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirectUri);
  if (url.pathname !== '/oauth2callback') {
    res.end();
    return;
  }

  const code = url.searchParams.get('code');
  res.end('Listo, ya puedes cerrar esta pestaña y volver a la terminal.');
  server.close();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.refresh_token) {
      console.error('\nNo se recibió refresh_token. Revoca el acceso previo en https://myaccount.google.com/permissions y vuelve a correr el script (el parámetro prompt=consent debería evitar esto, pero por si acaso).');
      process.exit(1);
    }
    console.log('\nCopia estas 3 variables en Render (Environment) del backend:\n');
    console.log('GOOGLE_OAUTH_CLIENT_ID=' + clientId);
    console.log('GOOGLE_OAUTH_CLIENT_SECRET=' + clientSecret);
    console.log('GOOGLE_OAUTH_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('Error al intercambiar el código por tokens:', error.message);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log('Abre esta URL en tu navegador, inicia sesión con tu cuenta de Google Drive personal y da permiso:\n');
  console.log(authUrl + '\n');
});
