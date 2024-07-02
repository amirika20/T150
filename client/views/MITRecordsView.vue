<script setup lang="ts">
import { ref } from "vue";

// Sample data structure
const categories = ref([
  {
    name: "2k",
    records: [
      { name: "2k", value: "6:13.9", holder: "Lucas Young", date: "2024" },
      { name: "2k", value: "6:16.1", holder: "Marc Rizk", date: "2024" },
      { name: "2k", value: "6:17.2", holder: "Richard Sollee", date: "2024" },
      { name: "2k", value: "6:18.5", holder: "Harry Sillifant", date: "2023" },
      { name: "2k", value: "6:18.6", holder: "Kieran Dunn", date: "2024" },
      { name: "2k", value: "6:18.6", holder: "Peyton Worthington", date: "2023" },
      { name: "2k", value: "6:20.4", holder: "Sam Costa", date: "2024" },
      { name: "2k", value: "6:21.6", holder: "Stephen Freiberg", date: "2012" },
    ],
  },
  {
    name: "6k",
    records: [
      { name: "6k", value: "20:06.0", holder: "Lucas Young", date: "2023" },
      { name: "6k", value: "20:06.8", holder: "Harry Sillifant", date: "2023" },
      { name: "6k", value: "20:08.0", holder: "Stephen Freiberg", date: "2012" },
      { name: "6k", value: "20:10.9", holder: "Marc Rizk", date: "2023" },
      { name: "6k", value: "20:14.7", holder: "Richard Sollee", date: "2024" },
      { name: "6k", value: "20:18.1", holder: "Sam Boshar", date: "2024" },
      { name: "6k", value: "20:20.1", holder: "Kieran Dunn", date: "2023" },
      { name: "6k", value: "20:23.7", holder: "Peyton Worthington", date: "2023" },
    ],
  },
  {
    name: "HOCH",
    records: [
      // { name: "Hour Record", value: "55.089 km", holder: "Victor Campenaerts", date: "2019-04-16" },
      //   { name: "Tour de France", value: "87h 20m 05s", holder: "Tadej Pogačar", date: "2020-09-20" },
    ],
  },
]);
</script>

<template>
  <div class="all-time-records">
    <h2>All-Time Records</h2>
    <div class="record-categories">
      <div class="record-category" v-for="category in categories" :key="category.name">
        <h3>{{ category.name }}</h3>
        <ul class="records-list">
          <li v-for="record in category.records" :key="record.name">
            <div class="record-info">
              <span class="record-value">{{ record.value }}</span>
            </div>
            <div class="record-holder">
              <span class="record-holder-name">{{ record.holder }}</span>
              <span class="record-date">{{ record.date }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.all-time-records {
  background-color: #f4f4f9;
  padding: 2em;
  border-radius: 10px;
  max-width: 800px;
  margin: 2em auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Roboto", sans-serif;
}

.all-time-records h2 {
  text-align: center;
  font-size: 2em;
  color: #333;
  margin-bottom: 1em;
}

.record-categories {
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.record-category {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1em;
}

.record-category h3 {
  font-size: 1.5em;
  color: #00796b;
  margin-bottom: 1em;
  text-align: center;
}

.records-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.records-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 0.5em 1em;
  border-radius: 5px;
  margin-bottom: 0.5em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.record-info {
  display: flex;
  flex-direction: column;
}

.record-name {
  font-weight: bold;
  color: #555;
}

.record-value {
  color: #333;
}

.record-holder {
  text-align: right;
  display: flex;
  gap: 10px; /* Adjust this value to give more or less space */
}

.record-holder-name {
  font-style: italic;
  color: #00796b;
}

.record-date {
  font-size: 0.85em;
  color: #777;
}

@media (max-width: 600px) {
  .records-list li {
    flex-direction: column;
    align-items: flex-start;
  }

  .record-holder {
    text-align: left;
    margin-top: 0.5em;
  }
}
</style>
