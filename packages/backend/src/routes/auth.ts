import { Router } from 'express';
import { SiweMessage } from 'siwe';
import { Service } from '../service';
import { authenticateUser, createUser } from '../turnkey-backend';

const router = Router();

//
// Access Code
//
router.post('/accesscode', async (req, res) => {
  console.log('Access Code', req.body);
  const { accesscode } = req.body;
  if (accesscode === '44444') {
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
  req.session.address = user.id;
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
    req.session.address = user.id;
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

//
// Lit
//

router.post('/validate', async (req, res) => {
  const { message, signature } = req.body;
  const { success, data } = await new SiweMessage(message).verify({
    signature,
  });

  console.log("VALIDATE CALL",message, signature )
  if (!success) {
    return res.send({ success, error: 'SIWE verifcation failed' } );
  }
  const service: Service = req.app.get('service');
  const user = await service.getUserByEthAddress(data.address);

  if (!user) {
    const newUser = await service.createUser({
      ethAddress: data.address,
      email: '',
      name: '',
      subOrgId: '',
      turnkeyWalletId: '',
    });
    req.session.address = newUser.id;
    req.session.chainId = data.chainId;
  } else {
    req.session.address = user.id;
    req.session.chainId = data.chainId;
  }
  console.log("VALIDATE CALL FINISHED", req.session)

  res.send({ success });
});

//
// General
//
router.get('/session', (req, res) => {
  if (req.session.address && req.session.chainId) {
    res.send({
      address: req.session.address,
      chainId: req.session.chainId
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
