<template>
  <div class="container fill" style="height: 100%">
    <cash-receipt-view />
  </div>
</template>

<script>
import CashReceiptView from "../../components/bill/CashReceiptView";

export default {
  components: {
    CashReceiptView,
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
