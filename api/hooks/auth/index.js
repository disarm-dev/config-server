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
        'GET /*': function (req, res, next) {
          let user = req.user;
          let resource = req.path;
          if(can(user, 'View', resource)){
            sails.log.info('Geting from ',resource)
            return next();
          }else{
            return 
          }
        }
      }
    }
  }
}

function can(user, action, resource){
  return true
}