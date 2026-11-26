
<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useManagementStore } from '../stores/management'
import StatusMessage from '../components/StatusMessage.vue'

const store = useManagementStore()
const { students, courses, enrollments, loading } = storeToRefs(store)

const studentId = ref('')
const courseId = ref('')
const selectedCourse = ref('')
const message = ref('')
const messageType = ref('success')

const roster = computed(() => {
  if (!selectedCourse.value) return []
  return enrollments.value.filter(
    e => e.course?._id === selectedCourse.value && e.student
  )
})

function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type
}

async function enrollStudent() {
  try {
    await store.addEnrollment(studentId.value, courseId.value)
    studentId.value = ''
    courseId.value = ''
    showMessage('Student enrolled successfully.')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

async function refreshRoster() {
  try {
    await store.loadEnrollments()
    showMessage('Enrollment list updated.')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

onMounted(async () => {
  try {
    await store.loadStudents()
    await store.loadCourses()
    await store.loadEnrollments()
  } catch (error) {
    showMessage(error.message, 'error')
  }
})
</script>

<template>
  <section>
    <h2>Enrollment Management</h2>

    <StatusMessage :message="message" :type="messageType" />

    <div class="panel">
      <h3>Enroll a Student</h3>

      <form @submit.prevent="enrollStudent">
        <label for="studentSelect">Select Student</label>
        <select id="studentSelect" v-model="studentId" required>
          <option value="">Choose a student</option>
          <option
            v-for="student in students"
            :key="student._id"
            :value="student._id"
          >
            {{ student.name }} ({{ student.id }})
          </option>
        </select>

        <label for="courseSelect">Select Course</label>
        <select id="courseSelect" v-model="courseId" required>
          <option value="">Choose a course</option>
          <option
            v-for="course in courses"
            :key="course._id"
            :value="course._id"
          >
            {{ course.courseId }} - {{ course.courseName }}
          </option>
        </select>

        <button :disabled="loading" type="submit">
          Enroll Student
        </button>
      </form>
    </div>

    <div class="panel">
      <h3>View Course Enrollment</h3>

      <label for="rosterCourse">Select Course</label>
      <select id="rosterCourse" v-model="selectedCourse">
        <option value="">Choose a course</option>
        <option
          v-for="course in courses"
          :key="course._id"
          :value="course._id"
        >
          {{ course.courseId }} - {{ course.courseName }}
        </option>
      </select>

      <button
        class="secondary"
        :disabled="loading"
        @click="refreshRoster"
      >
        Refresh Enrollment List
      </button>

      <p v-if="loading">Loading...</p>
      <p v-else-if="!selectedCourse">
        Select a course to view its enrolled students.
      </p>
      <p v-else-if="roster.length === 0">
        No students enrolled in this course.
      </p>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in roster" :key="item._id">
              <td>{{ item.student.name }}</td>
              <td>{{ item.student.id }}</td>
              <td>{{ item.student.phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
