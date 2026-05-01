const express = require('express')
const { default: makeWASocket, useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys')
const pino = require('pino')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>ASAD MD PAIR</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="background:#111;color:#fff;text-align:center;padding:20px;font-family:sans-serif">
        <h1>🤖 ASAD MD V8.0</h1>
        <h3>⚡ Powered By ASAD TECHX</h3>
        <form action="/pair" method="get">
            <input name="number" type="number" placeholder="923420717040" style="padding:15px;font-size:18px;width:280px;border-radius:10px;border:none" required>
            <br><br>
            <button type="submit" style="padding:15px 40px;font-size:18px;background:#25D366;color:#fff;border:none;border-radius:10px">GET PAIR CODE</button>
        </form>
        <br>
        <p>1. Number dalo + GET CODE dabao</p>
        <p>2. Code copy karo</p>
        <p>3. WhatsApp → Linked Devices → Link with phone number</p>
    </body>
    </html>
    `)
})

app.get('/pair', async (req, res) => {
    const number = req.query.number.replace(/[^0-9]/g, '')
    if (!number) return res.send('Number sahi dalo')
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        const Asad = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.macOS('Desktop'),
            auth: state
        })
        
        if (!Asad.authState.creds.registered) {
            await new Promise(r => setTimeout(r, 2000))
            let code = await Asad.requestPairingCode(number)
            code = code?.match(/.{1,4}/g)?.join('-') || code
            
            res.send(`
            <!DOCTYPE html>
            <html>
            <body style="background:#111;color:#fff;text-align:center;padding:20px;font-family:sans-serif">
                <h1>✅ YOUR PAIR CODE</h1>
                <h2 style="font-size:45px;color:#25D366;letter-spacing:5px">${code}</h2>
                <p>WhatsApp → Settings → Linked Devices</p>
                <p>Link with phone number → Code dalo</p>
                <br>
                <a href="/" style="color:#25D366">← Back</a>
                <p>⚡ ASAD MD V8.0 | ASAD TECHX</p>
            </body>
            </html>
            `)
        } else {
            res.send('<h1>Already Paired!</h1><a href="/">Back</a>')
        }
    } catch (e) {
        res.send(`<h1>Error</h1><p>${e.message}</p><a href="/">Back</a>`)
    }
})

app.listen(port, () => console.log(`Pair Site Running`))
