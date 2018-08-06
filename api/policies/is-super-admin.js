module.exports = async function (req, res, proceed) {
  if (!_.has(req.headers, 'api_key')) {
    return res.status(401).send('Missing api_key header');
  }

  const api_key = req.get('api_key')
  const session = await Session.findOne({api_key});
  const permission = await Permission.findOne({user_id:session.user_id})

  if (permission && permission.value === 'super-admin') {
    return proceed();
  }

 return res.status(401).send('Not Authorised');
  
};