const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('إسم المستخدم مطلوب')
    .isLength({ min: 3 })
    .withMessage('إسم المستخدم قصير جداً'),
  check('childName')
    .notEmpty()
    .withMessage('إسم الطفل مطلوب')
    .isLength({ min: 3 })
    .withMessage('إسم الطفل مطلوب'),
  check('email')
    .notEmpty()
    .withMessage('الإيميل مطلوب')
    .isEmail()
    .withMessage('صيغة الإيميل خاطئة')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('الإيميل موجود بالفعل'));
        }
      })
    ),
    
  check('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 6 })
    .withMessage("كلمة المرور يجب أن تحتوي 6 خانات على الأقل")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('كلمة المرور غير متطابقة');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('تأكيد كلمة المرور مطلوبة'),

  check('gender').notEmpty().withMessage('يجب عليك أدخال الجنس'),
  check('phone')
  .optional()
  .isMobilePhone(['ar-AE','ar-BH','ar-DZ','ar-EG','ar-IQ','ar-JO','ar-KW','ar-LB','ar-LY','ar-MA','ar-OM','ar-PS','ar-SA','ar-SY','ar-TN'])
  .withMessage('يجب عليك إدخال رقم هاتف صحيح'), 
   check('childAge').notEmpty().withMessage('يجب عليك إدخال إسم الطفل'),
 
  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('الإيميل مطلوب')
    .isEmail()
    .withMessage('كلمة المرور خاطئة'),

  check('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 6 })
    .withMessage("كلمة المرور يجب أن تحتوي 6 خانات على الأقل"),

  validatorMiddleware,
];