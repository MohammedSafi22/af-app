const mongoose = require('mongoose');

// schema 
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"إسم التصنيف مطلوب"],
        unique:[true,"إسم التصنيف يجب أن يكون غير مكرر"],
        minlength:[3,"إسم التصنيف قصير للغاية"],
        maxlength:[32,"إسم التصنيف طويل للغاية"]
    }
},{timestamps:true})
// model 
const CategoryModel = mongoose.model("Category",categorySchema);

module.exports = CategoryModel;