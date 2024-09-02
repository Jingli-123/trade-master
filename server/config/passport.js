var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var User = require("../models/user-model");


module.exports = (passport) => {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = process.env.PASSPORT_SECRET;
    passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
        
        try{
            let foundUser = await User.findOne({_id: jwt_payload._id}).exec();
            if(foundUser){
                return done(null, foundUser);
            }else{
                return done(null, false);
            }
        }catch(e){
            return done(e, false);
        }
    }) );
};