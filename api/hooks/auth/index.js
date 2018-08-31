module.exports = function auth(sails) {
  sails.log.info('Auth hook loaded')
  return {
    name:'Auth Hook', 
    initialize: function(cb) {
        //Initialise source of permissions
        return cb();
    },
    routes: {
      before: {
        'GET /*': function async (req, res, next) {
          sails.log.silly('Hook',req,res)
          return next();
         /*sails
          .models['session']
          .find({api_key:req.headers.api_key})
          .populate('user_id')
          .then(session => {
            req.$session = session
            return next();
          })*/
        }
      }
    }
  }
}