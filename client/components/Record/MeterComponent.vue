<script setup lang="ts">
import { computed } from "vue";
const props = defineProps(["record"]);

// Computed property to round the meters
const roundedMeters = computed(() => {
  return Math.round(props.record.meter);
});
</script>

<template>
  <div class="record-card">
    <div class="icon-container">
      <i class="fas fa-trophy"></i>
      <!-- Icon for achievements or records -->
    </div>
    <div class="athlete-info">
      <RouterLink :to="{ name: 'Profile', params: { username: props.record.rower } }" class="athlete">{{ props.record.rower }}</RouterLink>
      <p class="total-meter">
        <i class="fas fa-dumbbell"></i>
        Total Meters: <strong>{{ roundedMeters }}</strong>
      </p>
    </div>
  </div>
</template>

<style scoped>
.record-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 1em auto;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent background */
  padding: 1.5em;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.icon-container {
  background-color: #00796b; /* Teal background for icon container */
  color: #ffffff; /* White icon color */
  border-radius: 50%;
  padding: 0.5em;
  margin-bottom: 1em; /* Spacing below the icon */
}

.icon-container i {
  font-size: 2em; /* Larger icon size */
}

.athlete-type {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.athlete {
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 5px;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}

.athlete:hover {
  text-decoration: underline;
}

.total-meter {
  font-size: 1.2em;
  color: #555;
  display: flex;
  align-items: center;
}

.total-meter i {
  margin-right: 5px; /* Spacing between icon and text */
}
</style>
