#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')

// IMPORT ROUTES
const users = require('./routes/users')
const technicians = require('./routes/technicians')

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 5000
const port = process.env.PORT || defaultPort

app.use(users.routes())
app.use(technicians.routes())

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
