
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useManagementStore } from '../stores/management'
import StatusMessage from '../components/StatusMessage.vue'

const store = useManagementStore()
const { courses, loading } = storeToRefs(store)

const form = ref({ courseId: '', courseName: '' })
const message = ref('')
const messageType = ref('success')

function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type
}

async function addCourse() {
  try {
    await store.addCourse({ ...form.value })
    form.value = { courseId: '', courseName: '' }
    showMessage('Course added successfully.')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

async function deleteCourse(course) {
  if (!confirm(`Delete ${course.courseId}?`)) return

  try {
    await store.deleteCourse(course._id)
    showMessage('Course deleted successfully.')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

onMounted(async () => {
  try {
    await store.loadCourses()
  } catch (error) {
    showMessage(error.message, 'error')
  }
})
</script>

<template>
  <section>
    <h2>Course Management</h2>

    <StatusMessage :message="message" :type="messageType" />

    <div class="panel">
      <h3>Add a Course</h3>
      <form @submit.prevent="addCourse">
        <label for="courseId">Course ID</label>
        <input
          id="courseId"
          v-model.trim="form.courseId"
          placeholder="CIS 3339"
          required
        />

        <label for="courseName">Course Name</label>
        <input
          id="courseName"
          v-model.trim="form.courseName"
          placeholder="Enterprise Applications Development"
          required
        />

        <button :disabled="loading" type="submit">
          Add Course
        </button>
      </form>
    </div>

    <div class="panel">
      <h3>Course List</h3>
      <p v-if="loading">Loading courses...</p>
      <p v-else-if="courses.length === 0">
        No courses available.
      </p>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course._id">
              <td>{{ course.courseId }}</td>
              <td>{{ course.courseName }}</td>
              <td>
                <button
                  class="danger"
                  :disabled="loading"
                  @click="deleteCourse(course)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>


