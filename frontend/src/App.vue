
<template>
  <div class="app">
    <header class="header">
      <h1>Student Management System</h1>
      <p>CIS 3339 Homework 1</p>
    </header>

    <nav class="navigation" aria-label="Main navigation">
      <RouterLink to="/">Students</RouterLink>
      <RouterLink to="/courses">Courses</RouterLink>
      <RouterLink to="/enrollments">Enrollments</RouterLink>
    </nav>

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

