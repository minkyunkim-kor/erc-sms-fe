<template>
  <div>
    <v-row id="header-and-footer" justify="end">
      <p id="header-label">아이들이 영어로 행복한 세상 ERC 영어독서클럽</p>
    </v-row>
    <v-row justify="end" class="mt-1">
      <v-col cols="1">
        <v-img src="../../assets/erc_logo_small.png" />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="4">
        <p id="report-title">Monthly Report</p>
      </v-col>
    </v-row>
    <v-row justify="end" align="baseline" class="mt-0">
      <v-col cols="2">
        <p id="report-label" style="text-align: end">Date :</p>
      </v-col>
      <v-col cols="2">
        <v-text-field hide-details readonly class="pt-0 mt-0" />
      </v-col>
    </v-row>
    <v-row align="center">
      <span id="lstick" />
      <p id="report-label">Student Information</p>
    </v-row>
  </div>
</template>

<style scoped>
#header-and-footer {
  background-color: #00a0e9;
}
#header-label {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 11px;
  font-weight: 400;
  text-align: center;
  color: white;
  margin-right: 5px;
  margin-bottom: 0px;
}
#report-title {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0px;
}
#report-label {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-align: start;
  margin-bottom: 0px;
}
#lstick {
  width: 10px;
  background: black;
  height: 25px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
