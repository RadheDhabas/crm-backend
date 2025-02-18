function verifyUser(req, res) {
    console.log(req.query);
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
  
    // Check if mode and token were sent
    if (mode && token) {
      // Check the mode and token are correct
      if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        res.status(200).send(challenge);
      } else {
        res.status(403).json({ status: 'error', message: 'Verification failed' });
      }
    } else {
      res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }
  }

  export default verifyUser;