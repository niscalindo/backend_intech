/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jwt = require('jsonwebtoken');
const salt = "niscalindobangkit2020";

exports.isAunthenticated = function(req,res,next){
    try{
        let authHeader = req.headers.authorization;
        if (authHeader) {
            let token = authHeader.split(' ')[1];
            jwt.verify(token, salt, (err, user) => {
                if (err) {
                    res.status(403).send({ error: 'Not authorized to access this resource' });
                }else{
                    req.user = user;
                    next();
                }
            });
        } else {
            res.status(401).send({ error: 'Bad Request' });
        }
    }catch(exception){
        res.status(403).send({ error: 'Not authorized to access this resource' });
    }
};