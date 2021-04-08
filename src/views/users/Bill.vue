<template>
  <div class="container fill" style="height: 100%">
    <bill-view />
  </div>
</template>

<script>
import BillView from "../../components/bill/BillView";

export default {
  components: {
    BillView,
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
