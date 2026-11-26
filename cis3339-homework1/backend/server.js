
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const Student = require('./models/Student')
const Course = require('./models/Courses')
const Enrollment = require('./models/Enrollment')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

function clean(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function handleError(error, res) {
  console.error(error)

  if (error.code === 11000) {
    return res.status(409).json({
      error: 'This record already exists.'
    })
  }

  if (error.name === 'ValidationError' ||
      error.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid information provided.'
    })
  }

  return res.status(500).json({
    error: 'An unexpected server error occurred.'
  })
}

// STUDENTS

app.get('/api/students', async (req, res) => {
  try {
    const filter = {}

    if (req.query.name) {
      filter.name = {
        $regex: clean(req.query.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        $options: 'i'
      }
    }

    const students = await Student.find(filter).sort({ name: 1 })
    res.json(students)
  } catch (error) {
    handleError(error, res)
  }
})

app.post('/api/students', async (req, res) => {
  try {
    const name = clean(req.body.name)
    const id = clean(req.body.id)
    const phone = clean(req.body.phone)
    const zip = clean(req.body.zip)

    if (!name || !id || !phone || !zip) {
      return res.status(400).json({
        error: 'All student fields are required.'
      })
    }

    const student = await Student.create({
      name, id, phone, zip
    })

    res.status(201).json(student)
  } catch (error) {
    handleError(error, res)
  }
})

app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Student not found.'
      })
    }

    await Enrollment.deleteMany({ student: student._id })
    await student.deleteOne()

    res.json({ message: 'Student deleted successfully.' })
  } catch (error) {
    handleError(error, res)
  }
})

// COURSES

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseId: 1 })
    res.json(courses)
  } catch (error) {
    handleError(error, res)
  }
})

app.post('/api/courses', async (req, res) => {
  try {
    const courseId = clean(req.body.courseId)
    const courseName = clean(req.body.courseName)

    if (!courseId || !courseName) {
      return res.status(400).json({
        error: 'Course ID and name are required.'
      })
    }

    const course = await Course.create({ courseId, courseName })
    res.status(201).json(course)
  } catch (error) {
    handleError(error, res)
  }
})

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        error: 'Course not found.'
      })
    }

    await Enrollment.deleteMany({ course: course._id })
    await course.deleteOne()

    res.json({ message: 'Course deleted successfully.' })
  } catch (error) {
    handleError(error, res)
  }
})

// ENROLLMENTS

app.get('/api/enrollments', async (req, res) => {
  try {
    const filter = {}

    if (req.query.course) {
      filter.course = req.query.course
    }

    const enrollments = await Enrollment.find(filter)
      .populate('student')
      .populate('course')

    res.json(enrollments)
  } catch (error) {
    handleError(error, res)
  }
})

app.post('/api/enrollments', async (req, res) => {
  try {
    const { studentId, courseId } = req.body

    if (!studentId || !courseId) {
      return res.status(400).json({
        error: 'Select a student and course.'
      })
    }

    const student = await Student.findById(studentId)
    const course = await Course.findById(courseId)

    if (!student || !course) {
      return res.status(404).json({
        error: 'Student or course does not exist.'
      })
    }

    const enrollment = await Enrollment.create({
      student: student._id,
      course: course._id
    })

    res.status(201).json(enrollment)
  } catch (error) {
    handleError(error, res)
  }
})

// SERVE BUILT VUE APPLICATION

const distPath = path.join(__dirname, '../frontend/dist')

app.use(express.static(distPath))

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// START SERVER AFTER DATABASE CONNECTION

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    await Promise.all([
      Student.init(),
      Course.init(),
      Enrollment.init()
    ])

    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Startup failed:', error)
    process.exit(1)
  }
}

startServer()
