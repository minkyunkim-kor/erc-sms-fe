<template>
  <div class="container fill" style="height: 100%">
    <student-view />
  </div>
</template>

<script>
import StudentView from "../../components/student/StudentView";

export default {
  components: {
    StudentView,
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
