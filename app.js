const express = require('express')
const bodyParser = require('body-parser')
const port = 3000
const https = require('https')

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


    const url = "https://us8.api.mailchimp.com/3.0/lists/b0a4e9f2d" 
    const option = {
        method: 'POST',
        auth: "solo:2bf58bda3b72eae51f23015b2d73bf59-us8"
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


app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})


// api key for newslatter
// 2bf58bda3b72eae51f23015b2d73bf59-us8 
// list id 
// b0a4e9f2d3 