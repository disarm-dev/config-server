module.exports = async function (req, res, proceed) {
  const auth_header_matches_user = true
  
  
  if (auth_header_matches_user) {
    return proceed();
  }

  return res.status(401).send('Invalid Authorization header');
};