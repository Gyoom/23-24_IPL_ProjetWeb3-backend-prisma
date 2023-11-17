const router = require('express').Router()
const NotFoundError = require('../utils/NotFoundError')
const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient()


// Find all
router.get("/", async (req, res, next) => {
    await prisma.employee.findMany()
    .then(employees => res.json(employees))
    .catch(err => next(err))
})

// Find by ID
router.get("/:id", async (req, res, next) => {
    await prisma.employee.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(employee => {
        if (employee) {
        res.json(employee)
        } else {
        throw new NotFoundError()
        }
    }).catch(err => next(err))
})

// Find by Email
router.get("/email/:email", async (req, res, next) => {
    await prisma.employee.findUnique({
        where: {
            email: parseInt(req.params.email),
        }
    })
    .then(employee => {
        if (employee) {
        res.json(employee)
        } else {
        throw new NotFoundError()
        }
    }).catch(err => next(err))
})

// Delete one
router.delete("/:id", async (req, res, next) => {
    await prisma.employee.delete({
        where: {
        id: parseInt(req.params.id),
        },
    })
    .then(employee => {
            if (employee) {
            res.json(employee)
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
    await prisma.employee.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(employee => {
        if (employee && employee.length > 0) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
        }
    }).catch(err => next(err))
    // add new db object
    // todo
    let employee = {
        email: body.email,
        companyName: body.companyName,
        firstname: body.firstname,
        lastname: body.lastname
    }

    await prisma.employee.create({
        data: employee
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
    await prisma.employee.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(employee => {
        if (employee && employee.length > 0) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
        }
    }).catch(err => next(err))


    // Update
    await prisma.employee.update({
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
    .then(updatedEmployee => {
        if (updatedEmployee) {
            res.json(updatedEmployee)
        } else {
            throw new NotFoundError()
        }
    })
    .catch(error => next(error))
})

module.exports = router