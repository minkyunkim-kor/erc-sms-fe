<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html,
body,
.v-main__wrap {
  height: 100%;
  background-color: #f4f6f9 !important;
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
