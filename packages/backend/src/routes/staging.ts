import { Router } from 'express';

const router = Router();

router.get('/version', async (req, res) => {
  return res.send({ version: '0.0.7' });
});

export default router;
