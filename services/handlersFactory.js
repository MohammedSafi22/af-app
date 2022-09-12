const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.delete = (Model) => asyncHandler(async (req, res , next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
        return next(new ApiError('No document for this id',404))    }
    res.status(204).send();
});
exports.update = (Model) => asyncHandler(async(req, res , next)=>{
    const document = await Model.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!document){
        return next(new ApiError('No document for this id',404))
    }
    res.status(200).json({data:document})
});
exports.create = (Model) => asyncHandler(async(req, res)=>{
        const document = await Model.create(req.body);
        res.status(201).json({data:document});
});
exports.get = (Model) =>  asyncHandler(async(req, res, next)=>{
    const {id} = req.params;
    const document = await Model.findById(id);
    if(!document){
      return next(new ApiError('No document for this id',404))
    }
    res.status(200).json({data:document})
});
exports.getAll = (Model) => asyncHandler(async(req, res)=>{
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(),req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

    const {mongooseQuery,paginationResult} = apiFeatures;
    const document = await mongooseQuery;
 
    res.status(200).json({results:document.length,paginationResult,data:document})
});
 