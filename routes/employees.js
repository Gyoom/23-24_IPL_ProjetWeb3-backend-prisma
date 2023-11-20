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
    .then(employeeFound => {
        if (employeeFound) {
            res.json(employeeFound)
        } else {
            errorMessages = []
            errorMessages.push("employee not found")
            res.status(404).json({ errorMessages })
        }
    }).catch(err => next(err))
})

// Find by Email
router.get("/email/:email", async (req, res, next) => {
    await prisma.employee.findUnique({
        where: {
            email: req.params.email,
        }
    })
    .then(employeeFound => {
        if (employeeFound) {
            res.json(employeeFound)
        } else {
            errorMessages = []
            errorMessages.push("employee not found")
            res.status(404).json({ errorMessages })
        }
    }).catch(err => next(err))
})

// Delete one
router.delete("/:id", async (req, res, next) => {
    // Check existing
    var isEmployeeExist = true;
    await prisma.employee.findUnique({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(existingEmployee => {
        if (existingEmployee === null) {
            isEmployeeExist = false;
            errorMessages = []
            errorMessages.push("employee not found")
            res.status(404).json({ errorMessages })
        }
    }).catch(err => next(err))

    if (!isEmployeeExist)
        return

    // delete existing employee
    await prisma.employee.delete({
        where: {
            id: parseInt(req.params.id),
        },
    })
    .then(deletedEmployee => {
        res.json(deletedEmployee)
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
    var isEmployeeExist = false;
    await prisma.employee.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(employeeFound => {
        if (employeeFound) {
            errorMessages.push("email must be unique")
            res.status(422).json({ errorMessages })
            isEmployeeExist = true;
        }

    }).catch(err => next(err))

    if (isEmployeeExist)
        return
    // add new db object
    let employee = {
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        password: body.password,
        role : body.role ? body.role : "USER",
        managerId : body.managerId ? body.managerId : null
    }

    await prisma.employee.create({
        data: employee
      })
      .then(createdEmployee => {
        res.status(200).json(createdEmployee)
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
    var isEmployeeExist = true;
    await prisma.employee.findUnique({
        where: {
            email: body.email,
        }
    })
    .then(employee => {
        if (!employee) {
            errorMessages.push("employee not found")
            res.status(404).json({ errorMessages })
            isEmployeeExist = false;
        }
    }).catch(err => next(err))

    if (!isEmployeeExist)
        return

    // Update existing user
    await prisma.employee.update({
        where: {
            email: body.email,
        },
        data: {
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            password: body.password,
            role : body.role,
            managerId : body.managerId
        }
    })
    .then(updatedEmployee => {
        res.status(200).json(updatedEmployee)
    })
    .catch(error => next(error))
})


module.exports = router