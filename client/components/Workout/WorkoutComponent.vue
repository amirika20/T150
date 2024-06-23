<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { ref, computed } from "vue";

const props = defineProps(["workout"]);
const emit = defineEmits(["editWorkout", "refreshWorkouts"]);
const { currentUsername } = storeToRefs(useUserStore());
const showConfirmModal = ref(false);

const deleteWorkout = async () => {
  try {
    await fetchy(`/api/workouts/${props.workout._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshWorkouts");
  showConfirmModal.value = false;
};

const workoutIcon = computed(() => {
  switch (props.workout.type) {
    case "single":
      return "fa-solid fa-sailboat";
    case "double/pair":
      return "fa-solid fa-sailboat";
    case "eight":
      return "fa-solid fa-sailboat";
    case "erg":
      return "fa-running";
    case "running":
      return "fa-running";
    case "cycling":
      return "fa-bicycle";
    case "bikeerg":
      return "fa-biking";
    case "swimming":
      return "fa-swimmer";
    case "lift":
      return "fa-dumbbell";
    default:
      return "fa-dumbbell";
  }
});
</script>

<template>
  <div class="workout">
    <div class="workout-details">
      <div class="athlete-type">
        <RouterLink :to="{ name: 'Profile', params: { username: props.workout.athlete } }" class="athlete">{{ props.workout.athlete }}</RouterLink>
        <p class="workout-type"><i :class="['fas', workoutIcon]"></i> {{ props.workout.type }}</p>
      </div>
      <p class="meter"><i class="fas fa-road"></i> {{ Math.floor(props.workout.meter) }} meters</p>
      <p class="description"><i class="fas fa-sticky-note"></i> {{ props.workout.description }}</p>
    </div>
    <div class="actions">
      <menu v-if="props.workout.athlete == currentUsername">
        <li>
          <button class="delete-button" @click="showConfirmModal = true"><i class="fas fa-trash-alt"></i> Delete</button>
        </li>
      </menu>
      <p class="timestamp"><i class="far fa-clock"></i> Done on: {{ formatDate(props.workout.workoutDate) }}</p>
    </div>
  </div>

  <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
    <div class="modal-content">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this workout?</p>
      <button @click="deleteWorkout" class="confirm-button"><i class="fas fa-check"></i> Yes</button>
      <button @click="showConfirmModal = false" class="cancel-button"><i class="fas fa-times"></i> No</button>
    </div>
  </div>
</template>

<style scoped>
.workout {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.workout-details {
  display: flex;
  flex-direction: column;
}

.athlete-type {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.athlete {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 5px;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}

.athlete:hover {
  text-decoration: underline;
}

.workout-type {
  font-size: 0.9em;
  color: #777;
  margin-bottom: 5px;
}

.meter {
  font-size: 1em;
  color: #555;
}

.description {
  font-size: 1em;
  color: #555;
  margin-top: 10px;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  font-size: 0.9em;
  color: #777;
}

.delete-button {
  padding: 0.5em 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}

.delete-button i {
  margin-right: 5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 2em;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
}

.confirm-button {
  padding: 0.5em 1em;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
  margin-right: 1em;
}

.confirm-button:hover {
  background-color: #218838;
}

.confirm-button i {
  margin-right: 5px;
}

.cancel-button {
  padding: 0.5em 1em;
  background-color: #dc3545;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
}

.cancel-button:hover {
  background-color: #c82333;
}

.cancel-button i {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .workout {
    flex-direction: column;
    align-items: flex-start;
  }
  .actions {
    align-items: flex-start;
  }
}
</style>
