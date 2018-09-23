var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mymall') 

// 账号密码连接
// mongoose.connect('mongodb://root:123456@127.0.0.1:27017/dumall') 

// 连接成功
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected success~')
})

// 连接失败
mongoose.connection.on('error', () => {
  console.log('MongoDB connected fail~')
})

// 连接断开
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connected disconnected~')
})

// 查询商品列表数据  http://localhost:3000/goods?page=2&pageSize=8&sort=1&priceLevel=200 条件查询 分页skip+limit sort排序
router.get('/test', (req, res, next) => {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let priceLevel = req.param('priceLevel')
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let priceGt = ''
  let priceLte = ''
  let params = {}
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0
        priceLte=100
        break
      case '1':
        priceGt = 100
        priceLte = 500
        break
      case '2':
        priceGt = 500
        priceLte = 1000
        break
      case '3':
        priceGt = 1000
        priceLte = 5000
        break
    }
    params = {
      // $gt >  &lte <=
      salePrice: {
          $gt: priceGt,
          $lte: priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec((err,doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
  /* Goods.find({}, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  }) */
  // res.send('goods list test')
})

// 查询商品列表数据
router.get('/list', (req, res, next) => {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let priceLevel = req.param('priceLevel')
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let priceGt = ''
  let priceLte = ''
  let params = {}
  if (priceLevel != 'all') {
    switch (priceLevel){
      case '0':
        priceGt = 0
        priceLte=100
        break
      case '1':
        priceGt = 100
        priceLte=500
        break
      case '2':
        priceGt = 500
        priceLte=1000
        break
      case '3':
        priceGt = 1000
        priceLte=5000
        break
    }
    params = {
      salePrice:{
          $gt: priceGt,
          $lte: priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec((err,doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

// 加入购物车
router.post('/addCart', (req, res, next) => {
  let userId = '100000077'
  let productId = req.body.productId
  let User = require('../models/user')
  User.findOne({ userId }, (err, userDoc) => {
    if (err){
      res.json({ 
          status: '1',
          msg: err.message
      })
    } else {
      console.log(`userDoc: ${userDoc}`);
      if (userDoc) {
        var goodsItem = '';
        userDoc.cartList.forEach(item => {
          if (item.productId == productId) {
            goodsItem = item
            item.productNum ++
          }
        })
        if (goodsItem) {
          userDoc.save((err2, doc2) => {
            if (err2) {
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              })
            }
          })
        } else {
          Goods.findOne({ productId }, (err, doc) => {
            if( err) {
              res.json({
                status: '1',
                msg: err.message
              })
            } else {
              if (doc) {
                let { productId, productName, salePrice, productImage } = doc
                userDoc.cartList.push({
                  productId,
                  productName,
                  salePrice,
                  productImage,
                  productNum: 1, // 商品数量是1
                  checked: 1
                })

                userDoc.save((err2, doc2) => {
                  if(err2) {
                    res.json({
                      status: '1',
                      msg: err2.message
                    })
                  }else{
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router
