const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'พยายาม login บ่อยเกินไป กรุณาลองใหม่ภายหลัง' },
});

router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
