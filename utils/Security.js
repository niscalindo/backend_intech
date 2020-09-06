/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const algorithm = 'aes-256-ctr';
//const iv = crypto.randomBytes(16);
const salt = "niscalindobangkit2020";
//const key = crypto.createHash('sha256').update(String(salt)).digest('base64').substr(0, 32);

exports.encrypt = function (data, type) {
    return new Promise(
        function (resolve, reject) {
            if(type === "raw"){
                newData = proceedToEncryptRaw(data);
            }else{
                newData = proceedToEncrypt(data);
            }
            if(newData.status === 'success'){
              resolve(newData.data);
            }else{
                reject(newData.error);
            }
            
        }
    );
};

//function proceedToEncrypt(data, childData){
//    let encryptedData = new Object();
//    try{
//        if(Array.isArray(data)){
//            data.forEach((element, index) => {
//                let key = crypto.createCipher('aes-256-cbc', salt);
//                let encrypted = key.update(String(element.id), 'utf8', 'hex');
//                encrypted += key.final('hex');
//                data[index].dataValues.id = encrypted;
//                if(typeof childData !== 'undefined'){
//                    for(let i = 0; i<childData.length; i++){
//                        if(data[index].dataValues[childData[i]] !== null && data[index].dataValues[childData[i]] !== 'undefined'){
//                            if(Array.isArray(data[index].dataValues[childData[i]])){
//                                proceedToEncrypt(data[index].dataValues[childData[i]]);
//                            }else{
//                                let keyChild = crypto.createCipher('aes-256-cbc', salt);
//                                let encryptedChild = keyChild.update(String(data[index].dataValues[childData[i]].id), 'utf8', 'hex');
//                                encryptedChild += keyChild.final('hex');
//                                data[index].dataValues[childData[i]].dataValues.id = encryptedChild;                                
//                            }
//                        }
//                    }
//                }
//            });
//        }else{
//            let key = crypto.createCipher('aes-256-cbc', salt);
//            let encrypted = key.update(String(data.id), 'utf8', 'hex');
//            encrypted += key.final('hex');
//            data.dataValues.id = encrypted;
//            if(typeof childData !== 'undefined'){
//                for(let i = 0; i<childData.length; i++){
//                    if(data.dataValues[childData[i]] !== null && data.dataValues[childData[i]] !== 'undefined'){
//                        let keyChild = crypto.createCipher('aes-256-cbc', salt);
//                        let encryptedChild = keyChild.update(String(data.dataValues[childData[i]].id), 'utf8', 'hex');
//                        encryptedChild += keyChild.final('hex');
//                        data.dataValues[childData[i]].dataValues.id= encryptedChild;
//                    }
//                }
//            }
//        }
//        
//        encryptedData.status = "success";
//        encryptedData.data = data;
//        return encryptedData;
//    }catch(exception){
//        encryptedData.status = "error";
//        encryptedData.error = exception.message;
//        return encryptedData;
//    }
//}

function proceedToEncrypt(data){
    let encryptedData = new Object();
    try{
        if(Array.isArray(data)){
            data.forEach((element, index) => {
                if(data[index] !== null && typeof data[index].dataValues === 'object'){
                    for (let [key, value] of Object.entries(data[index].dataValues)) {
                        if(Array.isArray(value) || (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date))){
                            result = proceedToEncrypt(value);
                            if(result.status === 'success'){
                                value = result.data;
                            }else{
                                return result;
                            }
                        }else{
                            let substr = "id";
//                            if(key === 'id'){
//                                let key = crypto.createCipher('aes-256-cbc', salt);
//                                let encrypted = key.update(String(value), 'utf8', 'hex');
//                                encrypted += key.final('hex');
//                                data[index].dataValues.id = encrypted;
//                            }else
                            if(key.substring(0, 2).indexOf(substr) > -1){
                                let keyEncrypt = crypto.createCipher('aes-256-cbc', salt);
                                let encrypted = keyEncrypt.update(String(value), 'utf8', 'hex');
                                encrypted += keyEncrypt.final('hex');
                                data[index].dataValues[key] = encrypted;
                            }
                        }
                    }
                }
            });
        }else{
//            console.log(data.dataValues);
           for (let [key, value] of Object.entries(data.dataValues)) {
                if(Array.isArray(value) || (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date))){
                    result = proceedToEncrypt(value);
                    if(result.status === 'success'){
                        value = result.data;
                    }else{
                        return result;
                    }
                }else{
                    let substr = "id";
//                    if(key === 'id'){
//                        let key = crypto.createCipher('aes-256-cbc', salt);
//                        let encrypted = key.update(String(value), 'utf8', 'hex');
//                        encrypted += key.final('hex');
//                        data.dataValues.id = encrypted;
//                    }else
                    if(key.substring(0, 2).indexOf(substr) > -1){
                        let keyEncrypt  = crypto.createCipher('aes-256-cbc', salt);
                        let encrypted = keyEncrypt.update(String(value), 'utf8', 'hex');
                        encrypted += keyEncrypt.final('hex');
                        data.dataValues[key]= encrypted;
                    }
                }
           } 
        }
        encryptedData.status = "success";
        encryptedData.data = data;
        return encryptedData;
    }catch(exception){
//        console.log(exception);
        encryptedData.status = "error";
        encryptedData.error = exception.message;
        return encryptedData;
    }
}
function proceedToEncryptRaw(data){
    let encryptedData = new Object();
    try{
        if(Array.isArray(data)){
            data.forEach((element, index) => {
                if(data[index] !== null && typeof data[index] === 'object'){
                    for (let [key, value] of Object.entries(data[index])) {
                        if(Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof Date))){
                            result = proceedToEncryptRaw(value);
                            if(result.status === 'success'){
                                value = result.data;
                            }else{
                                return result;
                            }
                        }else{
                            let substr = "id";
//                            if(key === 'id'){
//                                let key = crypto.createCipher('aes-256-cbc', salt);
//                                let encrypted = key.update(String(value), 'utf8', 'hex');
//                                encrypted += key.final('hex');
//                                data[index].id = encrypted;
//                            }else
                            if(key.substring(0, 2).indexOf(substr) > -1){
                                let keyEncrypt  = crypto.createCipher('aes-256-cbc', salt);
                                let encrypted = keyEncrypt.update(String(value), 'utf8', 'hex');
                                encrypted += keyEncrypt.final('hex');
                                data[index][key] = encrypted;
                            }
                        }
                    }
                }
            });
        }else{
//            console.log(data.dataValues);
           for (let [key, value] of Object.entries(data)) {
                if(Array.isArray(value) || (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date))){
//                    console.log(key + " : "+(value instanceof Date));
                    result = proceedToEncryptRaw(value);
                    if(result.status === 'success'){
                        value = result.data;
                    }else{
                        return result;
                    }
                }else{
                    let substr = "id";
//                    if(key === 'id'){
//                        let key = crypto.createCipher('aes-256-cbc', salt);
//                        let encrypted = key.update(String(value), 'utf8', 'hex');
//                        encrypted += key.final('hex');
//                        data.id = encrypted;
//                    }else 
                    if(key.substring(0, 2).indexOf(substr) > -1){
                        let keyEncrypt = crypto.createCipher('aes-256-cbc', salt);
                        let encrypted = keyEncrypt.update(String(value), 'utf8', 'hex');
                        encrypted += keyEncrypt.final('hex');
                        data[key] = encrypted;
                    }
                }
           } 
        }
        encryptedData.status = "success";
        encryptedData.data = data;
        return encryptedData;
    }catch(exception){
//        console.log(exception);
        encryptedData.status = "error";
        encryptedData.error = exception.message;
        return encryptedData;
    }
}
exports.decrypt = function (text) {
    return new Promise(
        function (resolve, reject) {
            try{
                let result = new Array();
                for(let i =0; i< text.length; i++){
                    if(typeof text[i] !== 'undefined' && typeof text[i] !== null){
                        let key = crypto.createDecipher('aes-256-cbc', salt);
                        let decrypted = key.update(text[i], 'hex', 'utf8');
                        decrypted += key.final('utf8');
                        result[i] = decrypted;
                    }
                }
                resolve(result);
            }catch(exception){
                reject(exception);
            }
        }
    );
};

exports.generateToken = function (id, role){
    return new Promise(
        function (resolve, reject) {
            try{
                let accessToken = jwt.sign({ id: id,  role: role }, salt);
                resolve(accessToken);
            }catch(exception){
                reject(exception.message);
            }
        }
    );
};

