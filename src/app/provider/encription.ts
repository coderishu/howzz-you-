import {Injectable} from '@angular/core';
// import * as test from 'js-rijndael'; let rijndael =
// require('../../../node_modules/js-rijndael'); import * as rijndael from
// '../../../node_modules/js-rijndael'; import  * as base64Obj from
// '../../../node_modules/base64-js';
//let constants = require('../constant/config');
import {appConstant} from '../constant/app.constant';
//import * as CryptoJS from ('../../../src/assets/liberary/aes');
import * as CryptoJS from 'crypto-js';
//import * as CryptoJS from '../../../node_modules/crypto-js/crypto-js';
// let CryptoJS = require( '../../../src/assets/liberary/aes'); let crypto =
// require('../../../node_modules/node-cryptojs-aes/cryptojs');

@Injectable()
export class EncriptData {
  key = CryptoJS.enc.Base64.parse(appConstant.encryption.publicKey).toString();
  iv  = CryptoJS.enc.Base64.parse(appConstant.encryption.privateKey).toString();
  constructor() {
    
  }
  encryption(dataEncryption) : any {
    let encryptObj = Object.assign({}, dataEncryption);

   /// let privateKey = CryptoJS.enc.Utf8.parse(appConstant.encryption.privateKey).toString(); // WordArray object
    //let publicKey = CryptoJS.enc.Utf8.parse(appConstant.encryption.publicKey).toString();
    //let key = CryptoJS.enc.Hex.parse(publicKey);
   // let iv = CryptoJS.enc.Hex.parse(privateKey);

    //console.log(JSON.stringify(encryptObj))
    Object.keys(encryptObj).map((objKey) => {
       let message = encryptObj[objKey];
       //let message = CryptoJS.enc.Utf8.parse(encryptObj[objKey]).toString();
          //let message = CryptoJS.enc.Hex.parse(encryptObj[objKey]);
        let encrypted = CryptoJS.AES.encrypt(message.toString(), this.key, {iv: this.iv});
          encrypted = encrypted.toString();
           //console.log("after encrypt=="+textString);
        //var decrypted = CryptoJS.AES.decrypt(encrypted,key,{iv: iv});
       // console.log('decrypted:'+decrypted.toString(CryptoJS.enc.Utf8));

         encryptObj[objKey] = encrypted;
      });
    return encryptObj;
  }
  decryption(dataEncryption) : any {
    
    let encryptObj = Object.assign({}, dataEncryption);
 Object.keys(encryptObj).map((objKey) => {
       let message = encryptObj[objKey];
       
         //let  encrypted = message.toString();
           //console.log("after encrypt=="+textString);
        let decrypted = CryptoJS.AES.decrypt(message,this.key,{iv: this.iv});
        //console.log('decrypted:'+decrypted.toString(CryptoJS.enc.Utf8));

         encryptObj[objKey] = decrypted.toString(CryptoJS.enc.Utf8);
      });
    return encryptObj;
  }

}