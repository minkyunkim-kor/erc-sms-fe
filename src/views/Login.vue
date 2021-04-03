<template>
  <div class="container fill" style="height: 100%">
    <login-card />
  </div>
</template>

<script>
import LoginCard from "../components/login/LoginCard";

export default {
  components: {
    LoginCard,
  },
};
</script>

<style scoped>
.fill {
  min-height: 100%;
  align-content: center;
}
</style>
