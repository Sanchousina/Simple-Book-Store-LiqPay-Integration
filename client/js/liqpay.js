import { getPrivateKey } from "./env.js";
import { digestMessage } from "./util.js";

const publicKey = 'sandbox_i32103814271';
const privateKey = getPrivateKey();

export function setDataJSON (price) {
  return {
    'version': 3, 
    'public_key': publicKey,
    'private_key': privateKey,
    'action': 'pay',
    'amount': price,
    'currency': 'UAH', 
    'order_id': Date.now(),
    'description': 'test'
  }
}

export function generateData(dataJSON) {
  return btoa(JSON.stringify(dataJSON));
}

export async function generateSignature(data) {
  return await digestMessage(privateKey + data + privateKey);
}

export function liqPay(data, signature, successCb, errorCb) {
  (window.LiqPayCheckoutCallback = function() {
    LiqPayCheckout.init({
      data: data,
      signature: signature,
      embedTo: "#liqpay_checkout",
      language: "en",
      mode: "popup" // embed || popup
    }).on("liqpay.callback", function(data){
      if (data.status === 'success') successCb(data.status);
      else if (data.status === 'error') errorCb();
    }).on("liqpay.ready", function(data){
      // ready
    }).on("liqpay.close", function(data){
      // close
    });
  })();
}