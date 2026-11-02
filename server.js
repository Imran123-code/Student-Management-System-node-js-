const http = require('http')
const fs = require('fs');
const querystring = require('querystring')

const path = require('path')
const dataPath = path.join(__dirname, 'data', 'student.json')
http.createServer((req, res) => {
    let headerData = fs.readFileSync('Components/header.html', 'utf-8')
    let footrData = fs.readFileSync('Components/footer.html', 'utf-8')
    let file = 'pages/home.html'
    if (req.url !== '/' && req.url !== '/public/style.css') {
        file = "pages/" + req.url.substring(1) + '.html';
    }

    // 1. POST REQUEST HANDLING
    if (req.method === 'POST' && req.url === '/register') {
        let body = []
        req.on('data', (chunks) => {
            body.push(chunks)
        });
        req.on('end', () => {
            let rawData = Buffer.concat(body).toString();
            let readableData = querystring.parse(rawData);
            let students = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
            // Add new student
            students.push(readableData)
            // Save updated records
            fs.writeFileSync(dataPath, JSON.stringify(students, null, 2))
            console.log('Student saved successfully!')
            res.writeHead(200, { 'content-type': 'text/plain' })
            res.end('Student Registered Successfully!')
        })
        return
    }
    // GET METHOD
    if (req.method === 'GET' && req.url === '/students-data') {
        let students = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify(students))
        return
    }
    // run our js
    if (req.url === '/public/script.js') {

        fs.readFile('public/script.js', 'utf-8', (err, data) => {

            if (err) {
                res.writeHead(404, { 'content-type': 'text/plain' })
                res.end('JavaScript File Not Found')
                return
            }

            res.writeHead(200, { 'content-type': 'application/javascript' })
            res.end(data)
        })

        return
    }
    // READS HTML DATA
    if (req.url !== '/public/style.css') {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'content-type': 'text/plain' })
                res.end("Error loading HTML file")
                return
            }
            // console.log(ColletedHeaderData)
            res.writeHead(200, { 'content-type': 'text/html' })
            res.end(headerData + "" + data + "" + footrData)
        })
    } else if (req.url === '/public/style.css') { // READS CSS 
        fs.readFile('public/style.css', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'content-type': 'text/plain' })
                res.end("INVALID REQUEST")
                return false
            }
            else {
                res.writeHead(200, { 'content-type': 'text/css' })
                res.end(data)
            }
        })
    }
}).listen(9100, () => {
    console.log("Server running at http://localhost:9100")
});