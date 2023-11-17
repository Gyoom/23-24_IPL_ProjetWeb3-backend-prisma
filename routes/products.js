const router = require('express').Router()
const NotFoundError = require('../utils/NotFoundError')
const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient()


// Find all
router.get("/", async (req, res, next) => {
    await prisma.product.findMany()
    .then(products => res.json(products))
    .catch(err => next(err))
})

// Find by ID
router.get("/:id", async (req, res, next) => {
    await prisma.product.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(product => {
        if (product) {
        res.json(product)
        } else {
        throw new NotFoundError()
        }
    }).catch(err => next(err))
})

// Delete one
router.delete("/:id", async (req, res, next) => {
    await prisma.product.delete({
        where: {
        id: parseInt(req.params.id),
        },
    })
    .then(deletedProduct => {
            if (deletedProduct) {
            res.json(deletedProduct)
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
    if (!body.productName) errorMessages.push("Product name must be present")
    if (!body.unitPrice) errorMessages.push("Unit Price must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }
    // add new db object
    let newProduct = {
        productName: body.productName,
        unitPrice: body.unitPrice
    }

    await prisma.product.create({
        data: newProduct
      })
})

// Update one
router.put("/:id", async (req, res, next) => {
    const body = req.body
    // Check body
    const errorMessages = []
    if (!body.productName) errorMessages.push("Product name must be present")
    if (!body.unitPrice) errorMessages.push("Unit Price must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }
    // Check existing
    await prisma.product.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(existingProduct => {
        if (existingProduct && existingProduct.length > 0) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
        }
    }).catch(err => next(err))


    // Update
    await prisma.product.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: {
            productName: body.productName,
            unitPrice: body.unitPrice
        }
    })
    .then(updatedProduct => {
        if (updatedProduct) {
            res.json(updatedProduct)
        } else {
            throw new NotFoundError()
        }
    })
    .catch(error => next(error))
})

module.exports = router