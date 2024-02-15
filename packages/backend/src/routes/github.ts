import { Router } from 'express';
import debug from 'debug';

import { Service } from '../service';

const log = debug('snowball:routes-github');
const router = Router();

/* POST GitHub webhook handler */
// https://docs.github.com/en/webhooks/using-webhooks/handling-webhook-deliveries#javascript-example
router.post('/webhook', async (req, res) => {
  // Server should respond with a 2XX response within 10 seconds of receiving a webhook delivery
  // If server takes longer than that to respond, then GitHub terminates the connection and considers the delivery a failure
  res.status(202).send('Accepted');

  const service = req.app.get('service') as Service;
  const githubEvent = req.headers['x-github-event'];
  log(`Received GitHub webhook for event ${githubEvent}`);

  if (githubEvent === 'push') {
    // Create deployments using push event data
    await service.handleGitHubPush(req.body);
  }
});

export default router;
