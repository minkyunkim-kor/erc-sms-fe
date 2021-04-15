<template>
  <v-app>
    <router-view />
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
#btn-save {
  background-color: #1d89e4;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
  color: white !important;
}
#btn-search {
  background-color: grey;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
  color: white !important;
}
#title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 16px !important;
  color: #1c88e4 !important;
  font-weight: 800;
  margin-left: 10%;
  margin-bottom: 0px;
}
#card-input-title {
  background-color: #00c089 !important;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 16px !important;
  color: white !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
#card-edit-title {
  background-color: #673bb7 !important;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 16px !important;
  color: white !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
#card-upsert-title {
  background-color: #1d89e4 !important;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 16px !important;
  color: white !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
#no-data {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
  margin: 0px;
}
</style>
