const { check,body } = require('express-validator');
const bcrypt = require('bcryptjs');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');


exports.createUserValidator = [
    check('name')
      .notEmpty()
      .withMessage('إسم المستخدم مطلوب')
      .isLength({ min: 3 })
      .withMessage('إسم المستخدم قصير للغاية'),
      check('email')
      .notEmpty()
      .withMessage('الإيميل مطلوب')
      .isEmail()
      .withMessage('الإيميل غير صحيح')
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('يوجد مستخدم يمتلك الأيميل بالفعل'));
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
    check('phone')
    .isMobilePhone(['ar-AE','ar-BH','ar-DZ','ar-EG','ar-IQ','ar-JO','ar-KW','ar-LB','ar-LY','ar-MA','ar-OM','ar-PS','ar-SA','ar-SY','ar-TN'])
    .withMessage('يجب عليك إدخال رقم هاتف صحيح'),
    check('role').optional(),
    validatorMiddleware,

];
exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('رقم المستخدم خاطئ'),
  body('currentPassword')
    .notEmpty()
    .withMessage('يجب عليك إدخال كلمة المرور الحالية'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('يجب عليك تأكيد كلمة المرور'),
  body('password')
    .notEmpty()
    .withMessage('الرجاء إدخال كلمة المرور الجديدة')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('لا يوجد مستخدم');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error('كلمة المرور الحالية غير صحيحة');
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error('لقد قمت بإدخال تأكيد كلمة المرور بشكل خاطئ');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('رقم مستخدم خاطئ'),
    validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('رقم مستخدم خاطئ'),
  validatorMiddleware,
];
exports.updateLoggedUserValidator = [
  body('name')
    .optional(),
  check('email')
    .notEmpty()
    .withMessage('الإيميل مطلوب')
    .isEmail()
    .withMessage('الإيميل خاطئ')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('هذا الإيميل غير متاح'));
        }
      })
    ),
    check('phone')
    .isMobilePhone(['ar-AE','ar-BH','ar-DZ','ar-EG','ar-IQ','ar-JO','ar-KW','ar-LB','ar-LY','ar-MA','ar-OM','ar-PS','ar-SA','ar-SY','ar-TN'])
    .withMessage('يجب عليك إدخال رقم هاتف صحيح'),

  validatorMiddleware,
];

