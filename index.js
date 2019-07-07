require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()

const pool = require('./db.js')

app.use(cors())
app.use(express.json())

app.use(express.static('front/dist'))

app.get('/api', (req, res) => {
    pool.query('SELECT id, name FROM m_abc', (error, result) => {
        if (error) {
            console.error(error)
            return res.status(500).send(error)
        }
        console.log(result)
        return res.send(result)
    })
})

app.get('/api/:id', (req, res) => {
    pool.query('SELECT * FROM m_abc WHERE id = ?', req.params.id, (error, result) => {
        if (error) return res.status(500).send(error)
        if (!result || result.length === 0) return res.send('no song found')
        return res.send(result[0])
    })
})

app.post('/api', (req, res) => {
    let song = req.body
    console.log('received post request', song)
    if (!song.id || !/^(new|\d+$)/.test(song.id)) return res.status(400).send('invalid id')
    if (!song.abc) return res.status(400).send('missing abc field')

    if (song.id === 'new') {
        const abc = song.abc
        const name = abc.split('\n').find(x => x.substring(0,2) === 'T:').substring(2).trim()
        pool.query('INSERT INTO m_abc SET ?', { name, abc }, (error, result) => {
            if (error) {
                console.error(error)
                res.status(500).send(error)
                return
            }
            res.send(result)

        })
    } else {
        if (!song.name) {
            song.name = song.abc.split('\n').find(x => x.substring(0,2) === 'T:').substring(2);
            console.log('name not found, using', song.name)
        }
        const params = [song.name, song.abc, song.id]
        pool.query('UPDATE m_abc SET name = ?, abc = ? WHERE id = ?', params, (error, result) => {
            if (error) {
                console.error(error)
                res.status(500).send(error)
                return
            }
            res.send(result)
        })
    }
})

app.delete('/api/:id', (req, res) => {
    pool.query('DELETE FROM m_abc WHERE id = ?', req.params.id, (error, result) => {
        if (error) return res.status(500).send(error)
        return res.send(204)
    })
})

app.post('/api/login', (req, res) => {
    const pwdHash = process.env.PWD_HASH

    return bcrypt.compare(req.body.password, pwdHash)
        .then(pwdCorrect => {
          console.log('correct')
            if (pwdCorrect) {
                const token = jwt.sign({user: 'admin'}, process.env.SECRET)
                return res.status(200).send({token})
            } else {
                return res.status(401).send({error: 'incorect password'})
            }
        })
        .catch(error => {
            console.error("caught an error", error)
            res.status(500).send({error: error.toString()})
        })
})

app.listen(process.env.PORT, () => console.log('running on port', process.env.PORT))
