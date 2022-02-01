var request = require('request');

const AUTH_API_URL = 'https://api.testing.opensensemap.org/'

module.exports.isAuthenticated = async function isAuthenticated(req, res, next){
  const token = req.headers.authorization;
  const options = {
    'method': 'GET',
    'url': AUTH_API_URL + 'users/me/',
    'headers': {
      'Authorization': `Bearer ${token}`,
    },
  };
  request(options, (err, resp) => {
    if (err !== null || resp.statusCode === 403) {
      return res.status(403).send({message: 'Wrong password or username'})
    }
    if (resp.statusCode === 200) {
      //add the user to locals to check permissions in controller
      res.locals.user = JSON.parse(resp.body).data.me
      return next();
    }
  })
}



// module.exports.hasRole = async function hasRole(req){
//   console.log("AUTHENTICATING")
//   const token = req.headers.authorization;
//   console.log(token);
//   const options = {
//     'method': 'GET',
//     'url': 'https://api.testing.opensensemap.org/users/me/',
//     'headers': {
//       'Authorization': `Bearer ${token}`,
//     },
//   };
//   request(options, (err, resp) => {
//     console.log(resp.statusCode)
//     if (err !== null || resp.statusCode === 403) {
//       console.log("HALLOOOO")
//       return next(new Error('User Validation Error'))

//     }
//     if (resp.statusCode === 200) {
//       console.log(JSON.parse(resp.body).data.me);
//       return next();
//     }
//   })
//   // }).then(res => {console.log("AUTHENTICATED")})
//   // .catch(err => {console.log('error')});  ;
// }


// module.exports.isAuthenticatedExpert = async function isAuthenticated(req, res, next){
//   console.log("AUTHENTICATING")
//     const token = req.headers.authorization;
//     console.log(token);
//     const options = {
//       'method': 'GET',
//       'url': 'https://api.testing.opensensemap.org/users/me/',
//       'headers': {
//         'Authorization': `Bearer ${token}`,
//       },
//     };
//     request(options, (err, resp) => {
//       console.log(resp.statusCode)
//       if (err !== null || resp.statusCode === 403) {
//         console.log("HALLOOOOO")
//         return next(new Error('User Validation Error'))
//         // return res.status(403).send({message: 'Wrong password or username'})
//       }
//       if (resp.statusCode === 200 && JSON.parse(resp.body).data.me.role === ('admin' || 'expert')) {
//         console.log(JSON.parse(resp.body).data.me);
//         return next();
//       }
//     })
//   // }).then(res => {console.log("AUTHENTICATED")})
//   // .catch(err => {console.log('error')});  ;
// }


// module.exports.login = async function login(req){
//     console.log("HALLOOOOO")
//     await this.loginRequest(req).then(res => {
//         console.log("HALLOOOOO")
//         console.log(res);
//     }).catch(err => {console.log(err)})
// }

// module.exports.loginRequest = async function loginRequest(req) {
//     console.log("LOGIN REQUEST")
//     return new Promise((resolve, reject) => {
//         console.log(req)
//         const options = {
//             'method': 'POST',
//             'url': 'https://api.opensensemap.org/users/sign-in',
//             'json': true,
//             'body': req
//         };
//         request.post(options, (err, res) => {
//             console.log("REQUEST")
//             if (err !== null || res.statusCode === 403) {
//                 console.log(err);
//                 reject(new Error('User Validation Error'));
//             }
//             if (res) {
//                 console.log(res.body);
//                 resolve(res.body);
//             }
//         });
//     });
// }