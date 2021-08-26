const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const {jwtSecret} = require('../config/index');
const {DB} = require('../database');
const {DatabaseError} = require('sequelize');
const jwt = require('jsonwebtoken');

module.exports.authValidation = {
    validJWTNeeded,
    validJWTSocketNeeded
}

passport.use(
    new JWTStrategy(
        {
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
          secretOrKey: jwtSecret,
        },
        async (payload, cb) => {
            try {
                // console.log(payload);
                const { username } = payload || {};

                let userExistsResult = await DB.query(`CALL spstd_api_check_username(:p_username)`, {
                    replacements: {
                        p_username: username
                    }
                });

                userExistsResult = userExistsResult[0];
                if(!userExistsResult) throw 'User is somthing wrong.'
                userExistsResult.password = undefined;
                cb(null, userExistsResult);
            } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
              cb(error.message, false);
            }
            cb(error, false);
          }
        },
    ),
);

async function validJWTNeeded(req, res, next) {
  passport.authenticate('jwt', async (err, user, info) => {
    console.log(info);
    if (err || info instanceof Error) {
      const message = err || info.message;
      try {
      } catch (_) {
      }
      return res.status(401).json({message});
    } else {
      console.log(info);
      req.user = user;
      return next();
    }
  })(req, res, next);
}

async function validJWTSocketNeeded(socket, next) {
  try {
    
    const headers = socket.handshake.headers || {};

    const token = `${headers['authorization']}`.replace('Bearer ', '').trim();
    const { username } = jwt.verify(token, jwtSecret);
    let userExistsResult = await DB.query(`CALL spstd_api_check_username(:p_username)`, {
        replacements: {
            p_username: username
        }
    });
    userExistsResult = userExistsResult[0];
    if(!userExistsResult) throw 'User is somthing wrong.'
    userExistsResult.password = undefined;
    socket.user = userExistsResult;
    next();
  } catch (error) {
    return next(socketErrorHandler(401, error.message))
  }
}

function socketErrorHandler(statusCode, message) {
  const err = new Error();
  err.message = JSON.stringify({message, statusCode});
  err.statusCode = statusCode || 400;
  return err;
}
