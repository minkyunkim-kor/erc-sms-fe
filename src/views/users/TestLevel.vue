<template>
  <div class="container fill" style="height: 100%">
    <level-test-view />
  </div>
</template>

<script>
import LevelTestView from "../../components/learning/LevelTestView";

export default {
  components: {
    LevelTestView,
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
