<template>
  <div class="container fill" style="height: 100%">
    <report-view />
  </div>
</template>

<script>
import ReportView from "../../components/report/ReportView";

export default {
  components: {
    ReportView,
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
