
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useManagementStore = defineStore('management', () => {
  const students = ref([])
  const courses = ref([])
  const enrollments = ref([])
  const loading = ref(false)

  function errorMessage(error) {
    return error.response?.data?.error ||
      'Unable to connect to the server.'
  }

  async function request(action) {
    loading.value = true
    try {
      return await action()
    } catch (error) {
      throw new Error(errorMessage(error))
    } finally {
      loading.value = false
    }
  }

  async function loadStudents(name = '') {
    return request(async () => {
      const response = await axios.get('/api/students', {
        params: name ? { name } : {}
      })
      students.value = response.data
    })
  }

  async function addStudent(student) {
    return request(async () => {
      await axios.post('/api/students', student)
      const response = await axios.get('/api/students')
      students.value = response.data
    })
  }

  async function deleteStudent(id) {
    return request(async () => {
      await axios.delete(`/api/students/${id}`)
      students.value = students.value.filter(s => s._id !== id)
      enrollments.value = enrollments.value.filter(
        e => e.student?._id !== id
      )
    })
  }

  async function loadCourses() {
    return request(async () => {
      const response = await axios.get('/api/courses')
      courses.value = response.data
    })
  }

  async function addCourse(course) {
    return request(async () => {
      await axios.post('/api/courses', course)
      const response = await axios.get('/api/courses')
      courses.value = response.data
    })
  }

  async function deleteCourse(id) {
    return request(async () => {
      await axios.delete(`/api/courses/${id}`)
      courses.value = courses.value.filter(c => c._id !== id)
      enrollments.value = enrollments.value.filter(
        e => e.course?._id !== id
      )
    })
  }

  async function loadEnrollments(courseId = '') {
    return request(async () => {
      const response = await axios.get('/api/enrollments', {
        params: courseId ? { course: courseId } : {}
      })
      enrollments.value = response.data
    })
  }

  async function addEnrollment(studentId, courseId) {
    return request(async () => {
      await axios.post('/api/enrollments', {
        studentId,
        courseId
      })
      const response = await axios.get('/api/enrollments')
      enrollments.value = response.data
    })
  }

  return {
    students, courses, enrollments, loading,
    loadStudents, addStudent, deleteStudent,
    loadCourses, addCourse, deleteCourse,
    loadEnrollments, addEnrollment
  }
})
