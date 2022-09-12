const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');


const User = require('../models/userModel');



exports.signup = asyncHandler(async(req, res , next)=>{
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        gender:req.body.gender,
        phone: req.body.phone,
        childName: req.body.childName,
        childAge: req.body.childAge,
      });

     const token = createToken(user._id)
  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ApiError('هناك خطأ في الإيميل أو كلمة السر', 401));
    }
   
     const token = createToken(user._id)
    res.status(200).json({ data: user, token });
  });
exports.protect = asyncHandler(async (req, res, next) => {
     let token;
     if (
       req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer'))
     {
       token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new ApiError(
          "أنت لم تقم بتسجيل الدخول, الرجاء تسجيل الدخول",
          401
        )
      );
} 
 const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

   const currentUser = await User.findById(decoded.userId);
   if (!currentUser) {
     return next(
       new ApiError(
         "أنت لم تقم بتسجيل الدخول, الرجاء تسجيل الدخول",
         401
       )
     );
   }

   if (currentUser.passwordChangedAt) {
     const passChangedTimestamp = parseInt(
       currentUser.passwordChangedAt.getTime() / 1000,
       10
     );
     if (passChangedTimestamp > decoded.iat) {
       return next(
         new ApiError(
           "لقد قمت بتغيير كلمة المرور, الرجاء تسجيل الدخول مرة أخرى",
           401
         )
       );
     }
   }
   req.user = currentUser;
   next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('غير مصرح لك للوصول لهذا المسار', 403)
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
     const user = await User.findOne({ email: req.body.email });
    if (!user) {
       return next(
       new ApiError(`لا يوجد مستخدم يمتلك هذا الإيميل ${req.body.email}`, 404)
      );
     }
     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
     const hashedResetCode = crypto
       .createHash('sha256')
       .update(resetCode)
       .digest('hex');
  
     user.passwordResetCode = hashedResetCode;
    // Add expiration time for password reset code (10 min)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
     user.passwordResetVerified = false;
  
    await user.save();
  
     const message = `
          <h4>
          <strong>مرحبا ${user.name}</strong>
          <br>
          <strong>لقد استقبلنا منك طلب لإعادة إدخال كلمة المرور لتطبيق عالم أفكار</strong>
          <br>
          <h3><strong style="color:red">${resetCode}</strong></h3>
          <strong>الرجاء إدخال الكود لاستكمال عملية إدخال كلمة المرور</strong>
          <br>
          <strong>شكراً لمساعدتنا لجعل الحساب الخاص بك آمناً.</strong>
          <br>
          <strong>تطبيق عالم أفكار</strong>
          </h4>
      `;
     try {
       await sendEmail({
         email: user.email,
        // subject: 'Your password reset code (valid for 10 min)',
         subject:'الكود الخاص باسترجاع كلمة المرور الخاصة بك (متاح ل 10 دقائق)',
         message,
       });
     } catch (err) {
       user.passwordResetCode = undefined;
       user.passwordResetExpires = undefined;
       user.passwordResetVerified = undefined;
  
       await user.save();
       return next(new ApiError('يوجد خطأ أثناء إرسال الإيميل', 500));
     }
  
     res.status(200).json({ status: 'Success', message: 'رمز التأكيد تم إرساله على الإيميل' });  
  });
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(req.body.resetCode)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ApiError('رمز التأكيد خاطئ أو منتهي'));
    }
  
    user.passwordResetVerified = true;
    await user.save();
  
    res.status(200).json({
      status: 'Success',
    });
  });
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`لا يوجد مستخدم يمتلك هذا الإيميل ${req.body.email}`, 404)
      );
    }
  
    if (!user.passwordResetVerified) {
      return next(new ApiError('رمز التأكيد خاطئ', 400));
    }
  
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
  
    await user.save();
  
    const token = createToken(user._id);
    res.status(200).json({ token });
  });
  