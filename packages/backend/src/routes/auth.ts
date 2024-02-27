import { Router } from 'express';
import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';

const router = Router();
const secretKey = 'mySecretKey';

function generateToken (data: string) {
  const token = jwt.sign(data, secretKey);
  return token;
}

function verifyToken (token: string) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

router.post('/validate', async (req, res) => {
  let token = '';
  const { message, signature } = req.body;

  const { success, data } = await new SiweMessage(message).verify({
    signature
  });

  if (success) {
    token = generateToken(JSON.stringify({ chainId: data.chainId, address: data.address }));
  }

  res.send({ success, token });
});

router.get('/session', (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    const decodedToken = verifyToken(token.replace('Bearer ', ''));
    if (decodedToken) {
      // @ts-expect-error
      res.send({ chainId: decodedToken.chainId, address: decodedToken.address });
    }
  } else {
    res.send({ chainId: null, address: null });
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
