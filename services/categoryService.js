const Category = require('../models/categoryModel');
const factory = require('./handlersFactory')

exports.getCategories = factory.getAll(Category);

exports.getCategory = factory.get(Category);

exports.createCategory = factory.create(Category);

exports.updateCategory = factory.update(Category);

exports.deleteCategory = factory.delete(Category);