<template>
  <div class="container fill" style="height: 100%">
    <account-view />
  </div>
</template>

<script>
import AccountView from "../../components/account/AccountView";

export default {
  components: {
    AccountView,
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
