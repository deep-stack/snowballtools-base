import { Router } from 'express';
import { SiweMessage } from 'siwe';
import { Service } from '../service';
import { authenticateUser, createUser } from '../turnkey-backend';

const router = Router();

router.get('/registration/:email', async (req, res) => {
  const service: Service = req.app.get('service');
  const user = await service.getUserByEmail(req.params.email);
  if (user) {
    return res.send({ subOrganizationId: user?.subOrgId });
  } else {
    return res.sendStatus(204);
  }
});

router.post('/register', async (req, res) => {
  const { email, challenge, attestation } = req.body;
  const user = await createUser(req.app.get('service'), {
    challenge,
    attestation,
    userEmail: email,
    userName: email.split('@')[0],
  });
  req.session.userId = user.id;
  res.sendStatus(200);
});

router.post('/authenticate', async (req, res) => {
  const { signedWhoamiRequest } = req.body;
  const user = await authenticateUser(
    req.app.get('service'),
    signedWhoamiRequest,
  );
  if (user) {
    req.session.userId = user.id;
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

router.get('/session', (req, res) => {
  if (req.session.userId) {
    res.send({
      userId: req.session.userId,
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
