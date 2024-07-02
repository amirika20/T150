<script setup lang="ts">
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MeterComponent from "./MeterComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const records = ref<Array<Record<string, string>>>([]);

async function getAllMeter() {
  let recordResults;
  try {
    recordResults = await fetchy("/api/ranking", "GET", {});
    records.value = recordResults;
  } catch (error) {
    console.error("Failed to fetch records:", error);
    return;
  }
}

onBeforeMount(async () => {
  await getAllMeter();
  loaded.value = true;
});
</script>

<template>
  <section class="posts" v-if="loaded && records.length !== 0">
    <article v-for="(record, index) in records" :key="record._id" class="record-item">
      <div class="medal-wrapper" v-if="index < 3">
        <i v-if="index === 0" class="fas fa-medal gold"></i>
        <i v-if="index === 1" class="fas fa-medal silver"></i>
        <i v-if="index === 2" class="fas fa-medal bronze"></i>
      </div>
      <div class="icon-wrapper">
        <i class="fas fa-running"></i>
        <i class="fas fa-biking"></i>
        <i class="fas fa-swimmer"></i>
        <i class="fas fa-water"></i>
      </div>
      <MeterComponent :record="record" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.posts {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  margin: 0 auto;
  max-width: 60em;
}

.record-item {
  background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent background */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  position: relative;
}

.medal-wrapper {
  position: absolute;
  top: -30px;
  right: -30px;
}

.medal-wrapper i {
  font-size: 3em;
}

.gold {
  color: gold;
}

.silver {
  color: silver;
}

.bronze {
  color: #cd7f32;
}

.icon-wrapper {
  position: absolute;
  top: -20px;
  left: -20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.icon-wrapper i {
  font-size: 2em;
  color: #00796b;
  background: #e0f7fa;
  border-radius: 50%;
  padding: 0.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

p {
  text-align: center;
  color: #00796b;
  font-size: 1.2em;
}
</style>
