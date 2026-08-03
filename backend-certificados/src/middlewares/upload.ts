import multer from 'multer';

// Configurar multer para archivos en memoria
const storage = multer.memoryStorage();

// Validación de archivos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'excel') {
    // Validar Excel
    const validMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (validMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xls, .xlsx)'));
    }
  } else if (file.fieldname === 'pdfs') {
    // Validar PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'));
    }
  } else {
    cb(new Error('Campo no válido'));
  }
};

// Middleware para carga de certificados
export const uploadCertificados = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por archivo
    files: 51 // 50 PDFs + 1 Excel
  }
}).fields([
  { name: 'pdfs', maxCount: 50 },
  { name: 'excel', maxCount: 1 }
]);

// Middleware simple para un solo archivo
export const uploadSingleFile = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).single('file');

export default {
  uploadCertificados,
  uploadSingleFile
};
