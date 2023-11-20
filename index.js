const { PORT } = require('./utils/config')

const express = require("express")

const middlewares = require('./utils/middlewares')
const customersRouter = require('./routes/customers')
const employeesRouter = require('./routes/employees')
const ordersRouter = require('./routes/orders')
const orderDetailsRouter = require('./routes/orderDetails')
const productsRouter = require('./routes/products')

const infoRouter = require('./routes/info')


const app = express()

// use middlewares
app.use(express.json())
app.use(middlewares.logger)
app.use(middlewares.cors)
app.use(middlewares.errorHandler)

// routes
app.use('/', infoRouter)
app.use('/api/customers', customersRouter)
app.use('/api/employees', employeesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/ordersdetails', orderDetailsRouter)
app.use('/api/products', productsRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})