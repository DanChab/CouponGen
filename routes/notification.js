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

    router.post('/sendProductDetails', (req, res) => {
      let notificationObj = {}
      let affiliateId = req.body.affiliateId
      let collection = db.get('affiliateProducts')
      collection.find({'affiliateId': affiliateId}, (err, products) => { 
        if (err) throw err
        console.log(products)
        notificationObj.products = products
        if (products === null){
        console.log('No product found for notification')
        }else {
        //Get fbId      
          let affiliateUsers = db.get('affiliateUsers')
            affiliateUsers.find({}, (err, users) => {
              if (err) throw err
              console.log(JSON.stringify(users, undefined, 2))
              notificationObj.usersId = users
              res.send(notificationObj)
            })
        }
    
      })

    })

    router.post('/affiliateWithNotification', (req, res) => {
      let hasNotification = req.body.hasNotification
      let collection = db.get('affiliates')
      collection.find({hasNotification: hasNotification}, (err, result) => {
        if (err) throw err

        res.send(result)
      })

    })

  }
})
module.exports = router