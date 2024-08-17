const Product = require('../Models/Product')
const HttpError = require('../Models/HttpError')

const { validationResult } = require('express-validator')

exports.read = async (req, res, next) => {
  // const id = req.params.id
  // try{
  //     const prod = await Product.findOne({_id:id}).exec()  
  //     if(!prod){  
  //       const err = new Error('Product not found!')
  //       err.code = 404
  //       return next(err)
  //     }
  //     return res.send(prod)  
  //   }catch (err){
  //     return res.status(500).json({message:err.message})
  //  }
  try {
    const id = req.params.id
    const prod = await Product.findOne({ _id: id }).exec()
    if (!prod) {
      throw new HttpError('Product not found!', 404)
    }
    return res.send(prod)
  } catch (err) {
    return next(err)
  }
}

exports.list = async (req, res, next) => {
  try {
    const prodList = await Product.find({}).exec()
    if (!prodList) {
      throw new HttpError('Product not found!', 404)
    }
    return res.send(prodList)
  } catch (err) {
    return next(err)
  }
}

exports.create = async (req, res, next) => {
  const inputErr = validationResult(req)
  if(!inputErr.isEmpty()){
    return next(new HttpError('Invalid inputs passed, please check your data.',422))
  }


  try {
    const prod = await Product(req.body).save()
    if (!prod) {
      throw new HttpError('Could not create new product!')
    }
    return res.send(prod)
  } catch (err) {
    return next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const updated = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true }).exec()
    if (!updated) {
      throw new HttpError('Could not update product!')
    }
    return res.send(updated)
  } catch (err) {
    return next(err)
  }
}


exports.remove = async (req, res, next) => {
  try { 
    const id = req.params.id
    const removed = await Product.findOneAndDelete({ _id: id }).exec()
    if (!removed) {
      throw new HttpError('Could not remove product!')
    }
    return res.send(removed)
  } catch (err) {  
    return next(err)
  }
}

