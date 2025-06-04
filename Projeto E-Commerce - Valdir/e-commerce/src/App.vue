<template>
  <div class="flex h-screen">
    <NavbarComponent />
    <div class="flex-1 bg-green-200/80 p-6 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavbarComponent from "./components/NavbarComponent.vue";

export default {
  components: {
    NavbarComponent,
  },
};
</script>