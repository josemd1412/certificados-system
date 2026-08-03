import { drive } from '../config/googleDrive';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Obtiene la metadata de un archivo de Google Drive
 */
export const getFileById = async (fileId: string) => {
  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, webViewLink, webContentLink, size, createdTime'
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener archivo de Drive:', error);
    throw error;
  }
};

/**
 * Genera una URL pública para visualizar/descargar el archivo
 */
export const getFileUrl = async (fileId: string): Promise<string> => {
  try {
    const file = await getFileById(fileId);

    // Para PDFs, retornar URL de visualización
    if (file.mimeType === 'application/pdf') {
      return `https://drive.google.com/file/d/${fileId}/view`;
    }

    // Para otros tipos, retornar webViewLink
    return file.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
  } catch (error) {
    console.error('Error al generar URL del archivo:', error);
    throw error;
  }
};

/**
 * Busca archivos en una carpeta de Google Drive
 */
export const searchFiles = async (folderId: string, query?: string) => {
  try {
    let searchQuery = `'${folderId}' in parents and trashed=false`;

    if (query) {
      searchQuery += ` and name contains '${query}'`;
    }

    const response = await drive.files.list({
      q: searchQuery,
      fields: 'files(id, name, mimeType, webViewLink, createdTime)',
      orderBy: 'createdTime desc'
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error al buscar archivos en Drive:', error);
    throw error;
  }
};

/**
 * Verifica si el archivo existe y es accesible
 */
export const verifyFileAccess = async (fileId: string): Promise<boolean> => {
  try {
    await getFileById(fileId);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Crea una carpeta en Google Drive
 */
export const crearCarpeta = async (
  nombreCarpeta: string,
  parentFolderId?: string
): Promise<string> => {
  try {
    const fileMetadata: any = {
      name: nombreCarpeta,
      mimeType: 'application/vnd.google-apps.folder'
    };

    // Si se especifica una carpeta padre, agregar
    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId];
    } else if (process.env.DRIVE_FOLDER_ID) {
      // Si hay una carpeta raíz configurada, usar esa
      fileMetadata.parents = [process.env.DRIVE_FOLDER_ID];
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name'
    });

    console.log(`✓ Carpeta creada en Drive: ${response.data.name} (${response.data.id})`);
    return response.data.id!;
  } catch (error) {
    console.error('Error al crear carpeta en Drive:', error);
    throw error;
  }
};

/**
 * Sube un archivo a Google Drive
 */
export const subirArchivo = async (
  archivo: Buffer,
  nombreArchivo: string,
  folderId: string,
  mimeType: string = 'application/pdf'
): Promise<{ fileId: string; webViewLink: string }> => {
  try {
    const fileMetadata = {
      name: nombreArchivo,
      parents: [folderId]
    };

    const media = {
      mimeType: mimeType,
      body: Readable.from(archivo)
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    return {
      fileId: response.data.id!,
      webViewLink: response.data.webViewLink!
    };
  } catch (error) {
    console.error('Error al subir archivo a Drive:', error);
    throw error;
  }
};

/**
 * Lista archivos en una carpeta
 */
export const listarArchivosCarpeta = async (folderId: string): Promise<any[]> => {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, createdTime, webViewLink)',
      orderBy: 'createdTime desc'
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error al listar archivos de carpeta:', error);
    throw error;
  }
};

/**
 * Elimina un archivo de Google Drive
 */
export const eliminarArchivo = async (fileId: string): Promise<boolean> => {
  try {
    await drive.files.delete({
      fileId: fileId
    });
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de Drive:', error);
    return false;
  }
};

export default {
  getFileById,
  getFileUrl,
  searchFiles,
  verifyFileAccess,
  crearCarpeta,
  subirArchivo,
  listarArchivosCarpeta,
  eliminarArchivo
};
