<template>
  <div class="container fill" style="height: 100%">
    <unpaid-view />
  </div>
</template>

<script>
import UnpaidView from "../../components/bill/UnpaidView";

export default {
  components: {
    UnpaidView,
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
