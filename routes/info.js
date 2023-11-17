const router = require('express').Router()
const NotFoundError = require('../utils/NotFoundError')
const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient()

router.get("/info", async (req, res) => {
  var customersCount = 0
  var employeesCount = 0
  var ordersDetailsCount = 0
  var ordersCount = 0
  var productsCount = 0

  await prisma.customer.findMany()
  .then(customers => customersCount = customers.length)
  .catch(err => next(err))

  await prisma.employee.findMany()
  .then(employees => employeesCount = employees.length)
  .catch(err => next(err))

  await prisma.orderDetail.findMany()
  .then(ordersDetails => ordersCount = ordersDetails.length)
  .catch(err => next(err))

  await prisma.order.findMany()
  .then(orders => ordersCount = orders.length)
  .catch(err => next(err))

  await prisma.product.findMany()
  .then(products => productsCount = products.length)
  .catch(err => next(err))

  
  res.type("text").send(`Resume database ${new Date().toString()} : \n 
          --> ${customersCount} customers\n
          --> ${employeesCount} employees\n
          --> ${ordersDetailsCount} ordersDetails\n
          --> ${ordersCount} orders\n
          --> ${productsCount} products\n
  `)

})

module.exports = router