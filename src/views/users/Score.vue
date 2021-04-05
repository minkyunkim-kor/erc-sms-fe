<template>
  <div class="container fill" style="height: 100%">
    <score-view />
  </div>
</template>

<script>
import ScoreView from "../../components/learning/ScoreView";

export default {
  components: {
    ScoreView,
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
