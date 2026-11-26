
<script setup>
defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'success' }
})
</script>

<template>
  <p
    v-if="message"
    :class="['status-message', type]"
    role="status"
  >
    {{ message }}
  </p>
</template>
