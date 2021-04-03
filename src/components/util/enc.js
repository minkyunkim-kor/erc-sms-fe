import CryptoJS from "crypto-js";

function encryptValue(val) {
  return CryptoJS.AES.encrypt(val, process.env.VUE_APP_ENC_KEY).toString();
}

function decryptValue(val) {
  return CryptoJS.AES.decrypt(val, process.env.VUE_APP_ENC_KEY).toString(
    CryptoJS.enc.Utf8
  );
}

export default {
  encryptValue,
  decryptValue,
};
