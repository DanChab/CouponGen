const express = require('express')
const request = require('request')
const monk = require('monk')

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

let router = express.Router()
const db = monk('mongodb://couponizer:C0up0n1z3r123@ds119422.mlab.com:19422/couponizer', (err, db) => {
  
  if (err){
    return console.log(`Unable to connect to MongoDB server: error => ${err}`);
  }
  else{
    let collection = db.get('affiliateProducts')

    collection.find({}, (err, products) => {
      if (err) throw err
      console.log(products)

      if (products === null){
        console.log('No product found for notification')
      }else {

      // Get product details
        let elements = []
        let senderIds = []
        products.forEach((details) => {
            let productName = details.productName
            let productPrice = details.productPrice
            let productImage = details.productImage
      //let affiliate = details.affiliate

            elements.push({
                "title":`${productName}`,
                "image_url":productImage,
                "subtitle":`${productPrice}`,
                "buttons":[
                  {
                    "type": "postback",
                    "title": "🔖 Get Coupon ",
                    "payload": `GET_COUPON#`
                  }            
                ]      
              })
            })
              let msgContent = {
                "message":{
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"generic",
                    "sharable": true,
                    elements
                  }
                }
              }
            }
        //Get fbId
        let affiliateUsers = db.get('affiliateUsers')
        affiliateUsers.find({}, (err, users) => {
            if (err) throw err
              users.forEach((user) => {
              let senderId = user.fbId
              senderIds.push(senderId)
          })
      })

      sendNotification(msgContent, senderIds)
    }

})

  let sendNotification = (msgContent, senderIds) => {
    // Prepare template contnet for messenger and firebase
    for (let i = 0; i < senderIds.length; i++) {
      const senderId = senderIds[i]
      let messageData = {
        recipient: {
          id: senderId
        },
        message: msgContent
      }
              
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: messageData
    
      }, (error, response, body) => {
        if (!error && response.statusCode == 200){
          console(`Notification sent to fbId: ${messageData.recipient.id}`)
         }
        
        })

      }

    }

  }

})