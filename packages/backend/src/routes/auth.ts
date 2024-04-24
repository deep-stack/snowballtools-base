import { Router } from 'express';
import { SiweMessage } from 'siwe';
import { Service } from '../service';

const router = Router();

router.post('/validate', async (req, res) => {
  const { message, signature, action } = req.body;
  const { success, data } = await new SiweMessage(message).verify({
    signature,
  });

  if (!success) {
    return res.send({ success });
  }

  const service: Service = req.app.get('service');
  const user = await service.getUserByEthAddress(data.address);

  if (action === 'signup') {
    if (user) {
      return res.send({ success: false, error: 'user_already_exists' });
    }
    const newUser = await service.loadOrCreateUser(data.address);
    req.session.userId = newUser.id;
  } else if (action === 'login') {
    if (!user) {
      return res.send({ success: false, error: 'user_not_found' });
    }
    req.session.userId = user.id;
  }

  req.session.address = data.address;

  res.send({ success });
});

router.get('/session', (req, res) => {
  if (req.session.address) {
    res.send({
      userId: req.session.userId,
      address: req.session.address,
    });
  } else {
    res.status(401).send({ error: 'Unauthorized: No active session' });
  }
});

router.post('/logout', (req, res) => {
  // This is how you clear cookie-session
  (req as any).session = null;
  res.send({ success: true });
});

export default router;
