var mongoose = require('mongoose')
var Schema = mongoose.Schema

var produtSchema = new Schema({
  "productId": { type: String },
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "productNum": Number,  // 商品数量
  "checked": String  // 商品是否选中
})

module.exports = mongoose.model("Good", produtSchema)
