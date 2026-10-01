import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  keyGenerator: (req) => {
    return String(req.body?.correo ?? 'sin-correo');
  },

  standardHeaders: 'draft-8',
  legacyHeaders: false,

  message: {
    error:
      'Demasiados intentos de inicio de sesión. Intenta nuevamente más tarde.'
  }
});