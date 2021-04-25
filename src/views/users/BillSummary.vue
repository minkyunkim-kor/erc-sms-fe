<template>
  <div class="container fill" style="height: 100%">
    <bill-summary />
  </div>
</template>

<script>
import BillSummary from "../../components/bill/BillSummary";

export default {
  components: { BillSummary },
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
