const express = require('express')
const request = require('request')
const monk = require('monk')

const router = express.Router()
const db = monk('mongodb://couponizer:C0up0n1z3r123@ds119422.mlab.com:19422/couponizer', (err, db) => {
    if (err) {
        console.error(`Could not connect to mongoDB: error: ${err}`)
    }else {
        router.post('/userDetails', (req, res) => {
            let fbId = req.body.senderId
            let fbName = req.body.userName

            let collection = db.get('affiliateUsers')
            
            collection.findOne({'fbId': fbId}, (err, result) => {
                if (err) throw err
                if ( result === null) {
                    collection.insert({'fbId': fbId, 'fbName': fbName}, (err, result) => {
                        if (err) throw err
                        res.jsonp({statusCode: 200})
                    })
                }else {
                    res.jsonp({isUserRegistered: 'yes'})
                }
            })
        })
    }
})

module.exports = router