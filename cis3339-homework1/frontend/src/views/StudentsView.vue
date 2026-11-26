
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useManagementStore } from '../stores/management'
import StatusMessage from '../components/StatusMessage.vue'

const store = useManagementStore()
const { students, loading } = storeToRefs(store)

const searchName = ref('')
const form = ref({ name: '', id: '', phone: '', zip: '' })
const message = ref('')
const messageType = ref('success')

function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type
}

async function searchStudents() {
  try {
    await store.loadStudents(searchName.value)
    showMessage(
      students.value.length
        ? 'Search completed.'
        : 'No matching students found.'
    )
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

async function addStudent() {
  try {
    await store.addStudent({ ...form.value })
    form.value = { name: '', id: '', phone: '', zip: '' }
    searchName.value = ''
    showMessage('Student added successfully.')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

async function deleteStudent(student) {
  if (!confirm(`Delete ${student.name}?`)) return

  try {
    await store.deleteStudent(student._id)
    showMessage('Student deleted successfully.')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

onMounted(async () => {
  try {
    await store.loadStudents()
  } catch (error) {
    showMessage(error.message, 'error')
  }
})
</script>

<template>
  <section>
    <h2>Student Management</h2>

    <StatusMessage :message="message" :type="messageType" />

    <div class="panel">
      <h3>Search for a Student</h3>
      <form @submit.prevent="searchStudents">
        <label for="searchName">Student Name</label>
        <input
          id="searchName"
          v-model="searchName"
          placeholder="Enter student name"
        />
        <button :disabled="loading" type="submit">
          Search
        </button>
        <button
          type="button"
          class="secondary"
          :disabled="loading"
          @click="searchName = ''; searchStudents()"
        >
          Show All
        </button>
      </form>
    </div>

    <div class="panel">
      <h3>Add a Student</h3>
      <form @submit.prevent="addStudent">
        <label for="name">Name</label>
        <input id="name" v-model.trim="form.name" required />

        <label for="studentId">Student ID</label>
        <input id="studentId" v-model.trim="form.id" required />

        <label for="phone">Phone Number</label>
        <input id="phone" v-model.trim="form.phone" required />

        <label for="zip">ZIP Code</label>
        <input id="zip" v-model.trim="form.zip" required />

        <button :disabled="loading" type="submit">
          Add Student
        </button>
      </form>
    </div>

    <div class="panel">
      <h3>Student Results</h3>
      <p v-if="loading">Loading...</p>
      <p v-else-if="students.length === 0">
        No students to display.
      </p>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Phone</th>
              <th>ZIP</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student._id">
              <td>{{ student.name }}</td>
              <td>{{ student.id }}</td>
              <td>{{ student.phone }}</td>
              <td>{{ student.zip }}</td>
              <td>
                <button
                  class="danger"
                  :disabled="loading"
                  @click="deleteStudent(student)"
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

