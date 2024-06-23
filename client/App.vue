<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import router from "@/router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { currentUsername, isLoggedIn, currentSide } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const { logoutUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <RouterLink :to="{ name: 'Home' }"><img src="@/assets/images/logo.png" /></RouterLink>
        <RouterLink :to="{ name: 'Home' }" class="logo-text">T150</RouterLink>
      </div>
      <div class="dropdown">
        <button class="dropbtn">Menu</button>
        <div class="dropdown-content">
          <RouterLink v-if="isLoggedIn" :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }">Home</RouterLink>
          <RouterLink v-if="isLoggedIn" :to="{ name: 'Ranking' }">Ranking</RouterLink>
          <RouterLink v-if="isLoggedIn" :to="{ name: 'PRs' }">PRs</RouterLink>
          <RouterLink v-if="isLoggedIn" :to="{ name: 'MIT' }">MIT All Time Records</RouterLink>
          <RouterLink v-if="isLoggedIn" :to="{ name: 'Profile', params: { username: currentUsername } }" :class="{ underline: currentRouteName == 'Profile' }">Profile</RouterLink>
          <button v-if="isLoggedIn" class="pure-button pure-button-primary" @click="logout">Logout</button>
          <RouterLink v-if="!isLoggedIn" :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }">Login</RouterLink>
        </div>
      </div>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <div class="page">
    <RouterView />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"); /* Importing the Roboto font */
@import "./assets/toast.css";

body {
  background-image: url("@/assets/images/background.jpg"); /* Adjust the path to your image */
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed; /* Keeps the background fixed during scrolling */
  margin: 0; /* Removes default margin */
  font-family: "Roboto", sans-serif; /* Applying the Roboto font */
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

nav {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1em 2em;
  background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent background */
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-sizing: border-box; /* Ensure padding is included in width calculation */
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.logo-text {
  font-size: 2em;
  margin: 0;
  color: white;
  font-family: "Lobster", cursive; /* Applying the Lobster font for the logo text */
}

img {
  height: 3em;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5em 1em;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0; /* Align to the right */
  background-color: rgba(0, 0, 0, 0.8);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  flex-direction: column;
  overflow-x: hidden; /* Prevent dropdown from overflowing */
}

.dropdown-content a {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.dropdown:hover .dropdown-content {
  display: flex;
}

.dropdown:hover .dropbtn {
  background-color: rgba(0, 0, 0, 0.5);
}

.page {
  position: inherit;
  padding-top: 8em;
}

.underline {
  text-decoration: underline;
}

.toast {
  position: fixed;
  top: 60px;
  right: 20px;
  padding: 1em;
  background: white;
  color: black; /* Ensures text is readable against the white background */
  border-radius: 0.5em;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 300px; /* Ensures the toast doesn't get too wide */
  word-wrap: break-word; /* Breaks long words to fit within the toast box */
  font-size: 1em; /* Ensures the font size is readable */
}

.toast.success {
  border-left: 5px solid green; /* Adds a visual indicator for success */
}

.toast.error {
  border-left: 5px solid red; /* Adds a visual indicator for error */
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: flex-start;
    padding: 1em; /* Adjust padding for small screens */
  }

  .dropdown-content {
    min-width: 100%;
  }

  .dropdown-content a {
    text-align: left;
    padding-left: 1em;
  }
}
</style>
