const router = require('express').Router()
const NotFoundError = require('../utils/NotFoundError')
const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient()


// Find all
router.get("/", async (req, res, next) => {
    await prisma.customer.findMany()
    .then(customers => res.json(customers))
    .catch(err => next(err))
})

// Find by ID
router.get("/:id", async (req, res, next) => {
    await prisma.customer.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(customerFound => {
        if (customerFound) {
            res.json(customerFound)
        } else {
            errorMessages = []
            errorMessages.push("customer not found")
            res.status(404).json({ errorMessages })
        }
    }).catch(err => next(err))
})

// Find by Email
router.get("/email/:email", async (req, res, next) => {
    await prisma.customer.findUnique({
        where: {
            email: req.params.email,
        }
    })
    .then(customerFound => {
        if (customerFound) {
            res.json(customerFound)
        } else {
            errorMessages = []
            errorMessages.push("customer not found")
            res.status(404).json({ errorMessages })
        }
    }).catch(err => next(err))
})

// Delete one
router.delete("/:id", async (req, res, next) => {
    // Check existing
    var isCustomerExist = true;
    await prisma.customer.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(existingCustomer => {
        if (existingCustomer === null) {
            isCustomerExist = false;
            errorMessages = []
            errorMessages.push("customer not found")
            res.status(404).json({ errorMessages })
        }
    }).catch(err => next(err))

    if (!isCustomerExist)
        return

    // delete existing customer
    await prisma.customer.delete({
        where: {
            id: parseInt(req.params.id),
        },
    })
    .then(deletedCustomer => {
        res.json(deletedCustomer)
    })
    .catch(err => next(err))
});

// Insert one
router.post("/", async (req, res, next) => {
    const body = req.body
    // Check bodyparam
    const errorMessages = []
    if (!body.email) errorMessages.push("email must be present")
    if (!body.firstname) errorMessages.push("firstname must be present")
    if (!body.lastname) errorMessages.push("firstname must be present")
    if (!body.password) errorMessages.push("password must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }

    // Check existing
    var isCustomerExist = false;
    await prisma.customer.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(customer => {
        if (customer) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
            isCustomerExist = true;
        }

    }).catch(err => next(err))

    if (isCustomerExist)
        return
    // add new db object
    let customer = {
        email: body.email,
        companyName: body.companyName,
        firstname: body.firstname,
        lastname: body.lastname,
        password: body.password
    }

    await prisma.customer.create({
        data: customer
      })
      .then(createdCustomer => {
        res.status(200).json(createdCustomer)
      })
      .catch(err => next(err))      
})

// Update one
router.put("/:id", async (req, res, next) => {
    const body = req.body
    // Check body params
    const errorMessages = []
    if (!body.email) errorMessages.push("email must be present")
    if (!body.firstname) errorMessages.push("firstname must be present")
    if (!body.lastname) errorMessages.push("firstname must be present")
    if (!body.password) errorMessages.push("password must be present")
    
    if (errorMessages.length > 0) {
        res.status(422).json({ errorMessages })
        return
    }
    // Check existing
    var isCustomerExist = true;
    await prisma.customer.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(customer => {
        if (!customer) {
            errorMessages.push("customer not found")
            res.status(404).json({ errorMessages })
            isCustomerExist = false;
        }
    }).catch(err => next(err))

    if (!isCustomerExist)
        return

    // Update existing user
    await prisma.employee.update({
        where: {
            email: body.email,
        },
        data: {
            email: body.email,
            companyName: body.companyName,
            firstname: body.firstname,
            lastname: body.lastname,
            password: body.password
        }
    })
    .then(updatedCustomer => {
        res.status(200).json(updatedCustomer)
    })
    .catch(error => next(error))
})

module.exports = router