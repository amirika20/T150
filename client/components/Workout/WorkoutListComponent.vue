<script setup lang="ts">
// import EditWorkoutForm from "./EditWorkoutForm.vue";
import WorkoutComponent from "./WorkoutComponent.vue";
import CreateWorkoutForm from "./CreateWorkoutForm.vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchAthleteForm from "./SearchAthleteForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["createWorkoutEnabled", "startingFilter"]);

const loaded = ref(false);
let workouts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAthlete = ref("");

async function getWorkouts(athlete?: string) {
  let query: Record<string, string> = athlete !== undefined ? { athlete } : {};
  let workoutResults;
  try {
    workoutResults = await fetchy("/api/workouts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAthlete.value = athlete ? athlete : "";
  workouts.value = workoutResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

async function refreshWorkouts() {
  await getWorkouts(searchAthlete.value);
}

onBeforeMount(async () => {
  if (props.startingFilter) {
    await getWorkouts(props.startingFilter);
  } else {
    await getWorkouts();
  }
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn && props.createWorkoutEnabled" class="create-post">
    <h2>Create a post:</h2>
    <CreateWorkoutForm @refreshWorkouts="getWorkouts" />
  </section>
  <div class="row">
    <h2 v-if="!searchAthlete">Workouts:</h2>
    <h2 v-else>Workouts by {{ searchAthlete }}:</h2>
    <SearchAthleteForm @getWorkoutsByAthlete="getWorkouts" />
  </div>
  <section class="posts" v-if="loaded && workouts.length !== 0">
    <article v-for="workout in workouts" :key="workout._id">
      <WorkoutComponent v-if="editing !== workout._id" :workout="workout" @refreshWorkouts="getWorkouts" @editWorkout="updateEditing" />
      <!-- <EditWorkoutForm v-else :workout="workout" @refreshWorkouts="getWorkouts" @editWorkout="updateEditing" /> -->
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
:root {
  --primary-color: #3498db;
  --base-bg: rgba(245, 245, 245, 0.8); /* Slightly transparent */
  --secondary-bg: rgba(255, 255, 255, 0.8); /* Slightly transparent */
  --text-color: #333;
}

body {
  font-family: Arial, sans-serif;
  color: var(--text-color);
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 1em auto;
  padding: 1em;
  background-color: var(--secondary-bg);
  border-radius: 1em;
}

.create-post {
  max-width: 600px;
  margin: 0 auto 2em;
  padding: 1.5em;
}

.row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 60em;
}

.row h2 {
  margin: 0.5em 0;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
}

@media (min-width: 600px) {
  .row {
    flex-direction: row;
    justify-content: space-between;
  }

  .create-post,
  .posts {
    margin-top: 2em;
  }
}

@media (max-width: 599px) {
  .create-post {
    padding: 1em;
  }

  article {
    padding: 1em;
  }
}
</style>
