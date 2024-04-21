import { Router } from 'express';
import { SiweMessage } from 'siwe';

const router = Router();

router.post('/validate', async (req, res) => {
  const { message, signature } = req.body;
  const { success, data } = await new SiweMessage(message).verify({
    signature,
  });

  if (success) {
    req.session.address = data.address;
    req.session.chainId = data.chainId;
  }

  res.send({ success });
});

router.get('/session', (req, res) => {
  if (req.session.address && req.session.chainId) {
    res.send({ address: req.session.address, chainId: req.session.chainId });
  } else {
    res.status(401).send({ error: 'Unauthorized: No active session' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ success: false });
    }
    res.send({ success: true });
  });
});

export default router;
