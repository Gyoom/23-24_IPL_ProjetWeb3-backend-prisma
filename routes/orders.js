const router = require('express').Router()
const NotFoundError = require('../utils/NotFoundError')
const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient()


// Find all
router.get("/", async (req, res, next) => {
    await prisma.order.findMany()
    .then(orders => res.json(orders))
    .catch(err => next(err))
})

// Find by ID
router.get("/:id", async (req, res, next) => {
    await prisma.order.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(order => {
        if (order) {
        res.json(order)
        } else {
        throw new NotFoundError()
        }
    }).catch(err => next(err))
})

// Delete one
router.delete("/:id", async (req, res, next) => {
    await prisma.order.delete({
        where: {
        id: parseInt(req.params.id),
        },
    })
    .then(orderDeleted => {
            if (orderDeleted) {
            res.json(orderDeleted)
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
    const errorMessages = []
    if (!body.email) errorMessages.push("email must be present")
    if (!body.firstname) errorMessages.push("firstname must be present")
    if (!body.lastname) errorMessages.push("firstname must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }
    // Check existing
    await prisma.order.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(order => {
        if (order && order.length > 0) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
        }
    }).catch(err => next(err))
    // add new db object
    let order = {
        email: body.email,
        companyName: body.companyName,
        firstname: body.firstname,
        lastname: body.lastname
    }

    await prisma.order.create({
        data: order
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
    await prisma.order.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(existingOrder => {
        if (existingOrder && existingOrder.length > 0) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
        }
    }).catch(err => next(err))


    // Update
    await prisma.order.update({
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
    .then(updatedOrder => {
        if (updatedOrder) {
            res.json(updatedOrder)
        } else {
            throw new NotFoundError()
        }
    })
    .catch(error => next(error))
})

module.exports = router