const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:[true,'يجب إدخال الإسم'],
    },
    childName:{
        type:String,
        trim: true,
        required:[true,'يجب إدخال إسم الطفل'],
    },
    email: {
        type: String,
        required: [true, 'يجب إدخال الإيميل'],
        unique: true,
        lowercase: true,
    },
    phone: {
        type:String,
        required: [true, 'يجب إدخال رقم الهاتف'],
    },
    password: {
        type: String,
        required: [true, 'يجب إدخال كلمة المرور'],
        minlength: [6, 'كلمة المرور قصيرة للغاية'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    gender: {
        type: String,
        enum: ["father", "mother"],
      },
    childGender:{
        type: String,
        enum: ["boy", "girl"],
    },
    childAge:{
        type: String,
        enum: ['-6','6','7','8','9','10','11','12','+13'],
        default: 'user',
        required: [true, 'يجب إدخال سن الطفل'],
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
    },
},{timestamps:true});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
  })

const User = mongoose.model('User', userSchema);

module.exports = User;
