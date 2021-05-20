<template>
  <div class="container fill" style="height: 100%">
    <progress-view />
  </div>
</template>

<script>
import ProgressView from "../../components/progress/ProgressView";

export default {
  components: {
    ProgressView,
  },
};
</script>

<style scoped>
.fill {
  min-height: 100%;
  min-width: 100%;
  align-content: center;
  margin-left: 0%;
  margin-right: 0%;
}
</style>
