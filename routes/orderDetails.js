const router = require('express').Router()
const NotFoundError = require('../utils/NotFoundError')
const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient()


// Find all
router.get("/", async (req, res, next) => {
    await prisma.orderDetail.findMany()
    .then(ordersdetails => res.json(ordersdetails))
    .catch(err => next(err))
})

// Find by ID
router.get("/:id", async (req, res, next) => {
    await prisma.orderDetail.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(orderDetails => {
        if (orderDetails) {
        res.json(orderDetails)
        } else {
        throw new NotFoundError()
        }
    }).catch(err => next(err))
})

// Delete one
router.delete("/:id", async (req, res, next) => {
    await prisma.orderDetail.delete({
        where: {
        id: parseInt(req.params.id),
        },
    })
    .then(orderDetail => {
            if (orderDetail) {
            res.json(orderDetail)
            } else {
            throw new NotFoundError()
            }
    })
    .catch(err => next(err))
});

// Insert one
router.post("/", async (req, res, next) => {
    const body = req.body
    // Check body
    // Todo 
    const errorMessages = []
    if (!body.email) errorMessages.push("email must be present")
    if (!body.firstname) errorMessages.push("firstname must be present")
    if (!body.lastname) errorMessages.push("firstname must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }
    // Check existing
    await prisma.orderDetail.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(orderDetail => {
        if (orderDetail && orderDetail.length > 0) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
        }
    }).catch(err => next(err))
    // add new db object
    // todo
    let orderDetails = {
        email: body.email,
        companyName: body.companyName,
        firstname: body.firstname,
        lastname: body.lastname
    }

    await prisma.orderDetail.create({
        data: orderDetails
      })
})

// Update one
router.put("/:id", async (req, res, next) => {
    const body = req.body
    // Check body
    const errorMessages = []
    if (!body.email) errorMessages.push("email must be present")
    if (!body.firstname) errorMessages.push("firstname must be present")
    if (!body.lastname) errorMessages.push("firstname must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }
    // Check existing
    await prisma.orderDetail.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(orderDetails => {
        if (orderDetails && orderDetails.length > 0) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
        }
    }).catch(err => next(err))


    // Update
    await prisma.orderDetail.update({
        where: {
            email: body.email,
        },
        data: {
            email: body.email,
            companyName: body.companyName,
            firstname: body.firstname,
            lastname: body.lastname
        }
    })
    .then(updatedOrderDetails => {
        if (updatedOrderDetails) {
            res.json(updatedOrderDetails)
        } else {
            throw new NotFoundError()
        }
    })
    .catch(error => next(error))
})

module.exports = router