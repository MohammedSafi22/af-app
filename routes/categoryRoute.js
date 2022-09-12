const multer = require('multer');
const express = require('express');
const {getCategories,getCategory,createCategory,updateCategory,deleteCategory} = require('../services/categoryService');
const {getCategoryValidator,createCategoryValidator,updateCategoryValidator,deleteCategoryValidator} = require('../utils/validators/categoryValidator');

const authService = require('../services/authService');

const upload = multer({ dest: 'uploads/categories' })

const router = express.Router();

router.route('/')
.get(getCategories).
post(
    authService.protect,
    authService.allowedTo("admin"),
    upload.any(),createCategoryValidator,createCategory
);


router.route('/:id')
.get(getCategoryValidator,getCategory)
.put(
    authService.protect,
    authService.allowedTo("admin"),
    updateCategoryValidator,
    updateCategory
)
.delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
);

module.exports = router;