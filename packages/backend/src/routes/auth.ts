import { Router } from 'express';
import { SiweMessage } from 'siwe';
import { Service } from '../service';
import { authenticateUser, createUser } from '../turnkey-backend';

const router = Router();

router.post('/accesscode', async (req, res) => {
  console.log('Access Code', req.body);
  const { accesscode } = req.body;
  if (accesscode === '444444') {
    return res.send({ isValid: true });
  } else {
    return res.sendStatus(204);
  }
});

//
// Turnkey
//
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
  console.log('Register', req.body);
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
  console.log('Authenticate', req.body);
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

//
// Lit
//

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
    const newUser = await service.createUser({
      ethAddress: data.address,
      email: '',
      name: '',
      subOrgId: '',
      turnkeyWalletId: '',
    });
    req.session.userId = newUser.id;
  } else if (action === 'login') {
    if (!user) {
      return res.send({ success: false, error: 'user_not_found' });
    }
    req.session.userId = user.id;
  }

  res.send({ success });
});

//
// General
//
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
