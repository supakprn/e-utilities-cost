function notFound(req, res, next) {
  res.status(404).json({ message: `ไม่พบเส้นทาง: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
  });
}

module.exports = { notFound, errorHandler };
