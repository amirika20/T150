<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "@/router";
import PRForm from "../components/Record/PRForm.vue";
import PRViewComponent from "@/components/Record/PRViewComponent.vue";
import ChartComponent from "@/components/Asset/ChartComponent.vue";

const { currentUsername, currentSide } = storeToRefs(useUserStore());
const { deleteUser } = useUserStore();

const props = defineProps(["username"]);
const totalMeter = ref(0);
const PRs = ref<Array<Record<string, string>>>([]);
const showConfirmModal = ref(false);
const side = ref("");

async function fetchData() {
  try {
    totalMeter.value = await fetchy(`/api/meter/${props.username}`, "GET");
    PRs.value = await fetchy(`/api/prs/${props.username}`, "GET");
    side.value = (await fetchy(`/api/users/${props.username}`, "GET")).side;
  } catch (e) {
    console.log(e);
  }
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
  showConfirmModal.value = false;
}

onBeforeMount(async () => {
  await fetchData();
});
</script>

<template>
  <div class="full-wrapper">
    <div class="profile-wrapper">
      <div class="profile-info">
        <p class="username">{{ props.username }}</p>
        <p>{{ side }}</p>
        <p>Total meters: {{ totalMeter }}</p>
        <button v-if="props.username == currentUsername" class="button-error pure-button" @click="showConfirmModal = true">Delete User</button>
      </div>
      <PRForm v-if="props.username == currentUsername" />
      <div class="pr-list">
        <h3>Personal Records</h3>
        <article v-for="PR in PRs" :key="PR._id" class="pr-item">
          <PRViewComponent :PR="PR" />
        </article>
      </div>
      <div class="chart-title">
        <h3>Daily Workout Chart</h3>
      </div>
      <ChartComponent :username="props.username" />
    </div>

    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this user?</p>
        <button @click="delete_" class="confirm-button"><i class="fas fa-check"></i> Yes</button>
        <button @click="showConfirmModal = false" class="cancel-button"><i class="fas fa-times"></i> No</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

body {
  font-family: "Roboto", sans-serif;
  background-color: #e0f7fa;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.full-wrapper {
  padding: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-wrapper {
  background-color: #ffffff;
  border: 2px solid #00796b;
  border-radius: 10px;
  padding: 1em;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2em;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
  margin-bottom: 1em;
}

.username {
  font-weight: bold;
  font-size: 1.5em;
  color: #00796b;
  margin-bottom: 0.5em;
}

button {
  padding: 0.5em 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-secondary {
  background-color: #00796b;
  color: white;
}

.button-secondary:hover {
  background-color: #005f56;
}

.button-error {
  background-color: #d32f2f;
  color: white;
}

.button-error:hover {
  background-color: #b71c1c;
}

.pr-list {
  margin-top: 2em;
}

.pr-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 1em;
  margin-bottom: 1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  margin-top: 2em;
  font-weight: bold;
  font-size: 1.5em;
  color: #00796b;
}

.forms-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 100%;
  max-width: 600px;
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
