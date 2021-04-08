<template>
  <div class="container fill" style="height: 100%">
    <student-summary-view />
  </div>
</template>

<script>
import StudentSummaryView from "../../components/student/StudentSummaryView";

export default {
  components: {
    StudentSummaryView,
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
