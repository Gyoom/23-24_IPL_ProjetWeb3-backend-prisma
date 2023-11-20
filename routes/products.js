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
    .then(productFound => {
        if (productFound) {
            res.json(productFound)
        } else {
            errorMessages = []
            errorMessages.push("product not found")
            res.status(404).json({ errorMessages })
        }
    }).catch(err => next(err))
})

// Delete one
router.delete("/:id", async (req, res, next) => {
    // Check existing
    var isProductExist = true;
    await prisma.product.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(existingProduct => {
        if (existingProduct === null) {
            isProductExist = false;
            errorMessages = []
            errorMessages.push("product not found")
            res.status(404).json({ errorMessages })
        }
    }).catch(err => next(err))

    if (!isProductExist)
        return

    // delete existing product
    await prisma.product.delete({
        where: {
            id: parseInt(req.params.id),
        },
    })
    .then(deletedProduct => {
        res.json(deletedProduct)
    })
    .catch(err => next(err))
});

// Insert one
router.post("/", async (req, res, next) => {
    const body = req.body
    // Check bodyparam
    const errorMessages = []
    if (!body.productName) errorMessages.push("productName must be present")
    if (!body.unitPrice) errorMessages.push("unitPrice must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }

    // add new db object
    let product = {
        productName: body.productName,
        unitPrice : body.unitPrice,
        description : body.description
    }

    await prisma.product.create({
        data: product
      })
      .then(createdProduct => {
        res.status(200).json(createdProduct)
      })
      .catch(err => next(err))      
})

// Update one
router.put("/:id", async (req, res, next) => {
    const body = req.body
    // Check body params
    const errorMessages = []
    if (!body.productName) errorMessages.push("productName must be present")
    if (!body.unitPrice) errorMessages.push("unitPrice must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }
    // Check existing
    var isProductExist = true;
    await prisma.product.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(product => {
        if (!product) {
            errorMessages.push("product not found")
            res.status(404).json({ errorMessages })
            isProductExist = false;
        }
    }).catch(err => next(err))

    if (!isProductExist)
        return

    // Update existing user
    await prisma.product.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: {
            productName: body.productName,
            unitPrice : body.unitPrice,
            description : body.description
        }
    })
    .then(updatedProduct => {
        res.status(200).json(updatedProduct)
    })
    .catch(error => next(error))
})

module.exports = router