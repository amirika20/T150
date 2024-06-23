<script setup lang="ts">
import { ref } from "vue";

// Sample data structure
const categories = ref([
  {
    name: "2k",
    records: [
      { name: "100m Sprint", value: "9.58s", holder: "Usain Bolt", date: "2009-08-16" },
      //   { name: "Marathon", value: "2:01:39", holder: "Eliud Kipchoge", date: "2018-09-16" },
    ],
  },
  {
    name: "6k",
    records: [
      // { name: "100m Freestyle", value: "46.91s", holder: "César Cielo", date: "2009-07-30" },
      //   { name: "200m Butterfly", value: "1:50.73", holder: "Kristóf Milák", date: "2019-07-24" },
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
    <p>It will be updated soon. Here are just some dummy data for testing.</p>
    <div class="record-categories">
      <div class="record-category" v-for="category in categories" :key="category.name">
        <h3>{{ category.name }}</h3>
        <ul class="records-list">
          <li v-for="record in category.records" :key="record.name">
            <div class="record-info">
              <span class="record-name">{{ record.name }}</span>
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
