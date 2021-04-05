<template>
  <v-app>
    <side-menu />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import SideMenu from "../components/menu/SideMenu";
export default {
  components: {
    SideMenu,
  },
};
</script>

<style>
html,
body,
.v-main__wrap {
  height: 100%;
  background-color: #f4f6f9 !important;
  padding-left: 0px;
  padding-top: 0px;
}
table thead th {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: black !important;
}
table tbody td {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  color: black !important;
}
</style>
