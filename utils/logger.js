const log4js = require('log4js');

const SLACK_TOKEN = 'YOUR_SLACK_TOKEN HERE';
const SLACK_CHANNEL = 'YOUR_CHANNEL';
const SLACK_BOT_USERNAME = 'BOT_NAME';

const LOG_PATH = '/home/guest/Documents/sample_log/intech/';

log4js.configure({
  appenders: {
    consoleAppender:{
      type: 'console'
    },
    order: {
      type: 'dateFile',
      filename: `${LOG_PATH}order.log`
    },
    address: {
      type: 'dateFile',
      filename: `${LOG_PATH}address.log`
    },
    bankAccount: {
      type: 'dateFile',
      filename: `${LOG_PATH}bank_account.log`
    },
    brand: {
      type: 'dateFile',
      filename: `${LOG_PATH}brand.log`
    },
    captcha: {
      type: 'dateFile',
      filename: `${LOG_PATH}captcha.log`
    },
    cart: {
      type: 'dateFile',
      filename: `${LOG_PATH}cart.log`
    },
    categoryProduct: {
      type: 'dateFile',
      filename: `${LOG_PATH}category_product.log`
    },
    courier: {
      type: 'dateFile',
      filename: `${LOG_PATH}courier.log`
    },
    delivery: {
      type: 'dateFile',
      filename: `${LOG_PATH}delivery.log`
    },
    district: {
      type: 'dateFile',
      filename: `${LOG_PATH}district.log`
    },
    fileUpload: {
      type: 'dateFile',
      filename: `${LOG_PATH}file_upload.log`
    },
    follower: {
      type: 'dateFile',
      filename: `${LOG_PATH}follower.log`
    },
    furtherSubCategory: {
      type: 'dateFile',
      filename: `${LOG_PATH}furtherSubCategory.log`
    },
    mailin: {
      type: 'dateFile',
      filename: `${LOG_PATH}mail_in.log`
    },
    mailout: {
      type: 'dateFile',
      filename: `${LOG_PATH}mail_out.log`
    },
    product: {
      type: 'dateFile',
      filename: `${LOG_PATH}product.log`
    },
    productLike: {
      type: 'dateFile',
      filename: `${LOG_PATH}product_like.log`
    },
    productVarian: {
      type: 'dateFile',
      filename: `${LOG_PATH}product_varian.log`
    },
    promo: {
      type: 'dateFile',
      filename: `${LOG_PATH}promo.log`
    },
    province: {
      type: 'dateFile',
      filename: `${LOG_PATH}province.log`
    },
    regency: {
      type: 'dateFile',
      filename: `${LOG_PATH}regency.log`
    },
    review: {
      type: 'dateFile',
      filename: `${LOG_PATH}review.log`
    },
    slider: {
      type: 'dateFile',
      filename: `${LOG_PATH}slider.log`
    },
    subCategoryProduct: {
      type: 'dateFile',
      filename: `${LOG_PATH}sub_category_product.log`
    },
    unit: {
      type: 'dateFile',
      filename: `${LOG_PATH}unit.log`
    },
    user: {
      type: 'dateFile',
      filename: `${LOG_PATH}user.log`
    },
    userPaymentAccount: {
      type: 'dateFile',
      filename: `${LOG_PATH}user_payment_account.log`
    },
    users: {
      type: 'dateFile',
      filename: `${LOG_PATH}users.log`
    },
    virtualAccount: {
      type: 'dateFile',
      filename: `${LOG_PATH}virtual_account.log`
    },
    visitor: {
      type: 'dateFile',
      filename: `${LOG_PATH}visitor.log`
    },
    userVerification: {
      type: 'dateFile',
      filename: `${LOG_PATH}user_verification.log`
    },
    resetPassword: {
      type: 'dateFile',
      filename: `${LOG_PATH}reset_password.log`
    }
  },
  categories: {
    default: { appenders: ['consoleAppender'], level: 'ALL' },
    order: { appenders: ['order'], level: 'info' },
    address: { appenders: ['address'], level: 'info' },
    bankAccount: { appenders: ['bankAccount'], level: 'info' },
    brand: { appenders: ['brand'], level: 'info' },
    visitor: { appenders: ['visitor'], level: 'info' },
    captcha: { appenders: ['captcha'], level: 'info' },
    cart: { appenders: ['cart'], level: 'info' },
    categoryProduct: { appenders: ['categoryProduct'], level: 'info' },
    courier: { appenders: ['courier'], level: 'info' },
    resetPassword: { appenders: ['resetPassword'], level: 'info' },
    delivery: { appenders: ['delivery'], level: 'info' },
    district: { appenders: ['district'], level: 'info' },
    fileUpload: { appenders: ['fileUpload'], level: 'info' },
    follower: { appenders: ['follower'], level: 'info' },
    furtherSubCategory: { appenders: ['furtherSubCategory'], level: 'info' },
    mailin: { appenders: ['mailin'], level: 'info' },
    mailout: { appenders: ['mailout'], level: 'info' },
    product: { appenders: ['product'], level: 'info' },
    productVarian: { appenders: ['productVarian'], level: 'info' },
    promo: { appenders: ['promo'], level: 'info' },
    province: { appenders: ['province'], level: 'info' },
    regency: { appenders: ['regency'], level: 'info' },
    review: { appenders: ['review'], level: 'info' },
    slider: { appenders: ['slider'], level: 'info' },
    subCategoryProduct: { appenders: ['subCategoryProduct'], level: 'info' },
    unit: { appenders: ['unit'], level: 'info' },
    user: { appenders: ['user'], level: 'info' },
    userPaymentAccount: { appenders: ['userPaymentAccount'], level: 'info' },
    users: { appenders: ['users'], level: 'info' },
    userVerification: { appenders: ['userVerification'], level: 'info' },
    virtualAccount: { appenders: ['virtualAccount'], level: 'info' }
  },
});

module.exports = {
  console: log4js.getLogger('consoleAppender'),
  address: log4js.getLogger('address'),
  order: log4js.getLogger('order'),
  bankAccount: log4js.getLogger('bankAccount'),
  brand: log4js.getLogger('brand'),
  visitor: log4js.getLogger('visitor'),
  userVerification: log4js.getLogger('userVerification'),
  captcha: log4js.getLogger('captcha'),
  resetPassword: log4js.getLogger('resetPassword'),
  cart: log4js.getLogger('cart'),
  categoryProduct: log4js.getLogger('categoryProduct'),
  courier: log4js.getLogger('courier'),
  delivery: log4js.getLogger('delivery'),
  district: log4js.getLogger('district'),
  fileUpload: log4js.getLogger('fileUpload'),
  follower: log4js.getLogger('follower'),
  furtherSubCategory: log4js.getLogger('furtherSubCategory'),
  mailin: log4js.getLogger('mailin'),
  mailout: log4js.getLogger('mailout'),
  product: log4js.getLogger('product'),
  productLike: log4js.getLogger('productLike'),
  productVarian: log4js.getLogger('productVarian'),
  promo: log4js.getLogger('promo'),
  province: log4js.getLogger('province'),
  regency: log4js.getLogger('regency'),
  review: log4js.getLogger('review'),
  slider: log4js.getLogger('slider'),
  subCategoryProduct: log4js.getLogger('subCategoryProduct'),
  unit: log4js.getLogger('unit'),
  user: log4js.getLogger('user'),
  userPaymentAccount: log4js.getLogger('userPaymentAccount'),
  users: log4js.getLogger('users'),
  virtualAccount: log4js.getLogger('virtualAccount')
};