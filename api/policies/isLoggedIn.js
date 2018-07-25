module.exports = async function (req, res, proceed) {
  if (!_.has(req.headers, 'api_key')) {
    return res.status(401).send('Missing api_key header');
  }

  const api_key = req.get('api_key')
  const session = await Session.findOne({api_key});

  if (!session) {
    return res.status(401).send('Invalid api_key header');
  }
  
  return proceed();
};