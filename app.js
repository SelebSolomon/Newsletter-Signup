const dotenv = require('dotenv')
dotenv.config()


const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')


const api_key = process.env.API_KEY
const list_id = process.env.LIST_ID

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))


app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/signup.html")
})



app.post("/", (req, res) => {
    const firstName = req.body.firstName
    const secondName = req.body.secondName
    const email = req.body.email
    
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName
                  
                }
            }
        ]
    }
    
    const jsonData = JSON.stringify(data)


    const url = `https://us8.api.mailchimp.com/3.0/lists/${list_id}` 
    const option = {
        method: 'POST',
        auth:  `solomon1:${api_key}`
    }

  const request =  https.request(url, option, (response) => {

    if (response.statusCode === 200) {
        res.sendFile(__dirname + '/success.html')
    } else{
        res.sendFile(__dirname + '/failure.html')
    }

        response.on("data", (data)=>{
                console.log(JSON.parse(data))
        })
    })

        request.write(jsonData)
        request.end()
})



app.post('/failure', (req, res) => {
    res.redirect("/")
})


app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
})


// api key for newslatter
// 2bf58bda3b72eae51f23015b2d73bf59-us8 
// list id 
// b0a4e9f2d3 

// second key 
// 3fd93cda467936c800ef6cac7ce13d58-us8