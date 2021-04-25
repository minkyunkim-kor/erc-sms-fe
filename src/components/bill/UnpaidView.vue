<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">미납금 현황</p>
      </v-col>
      <v-spacer />
      <v-col cols="2">
        <v-select
          id="add-input"
          :items="years"
          v-model="targetYear"
          prepend-icon="mdi-calendar"
        />
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="unpaid" disable-sort>
      <template v-slot:no-data>
        <p id="no-data">미납금 정보가 없습니다.</p>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";

export default {
  created() {
    this.getUnpaidInfo();
  },
  watch: {
    targetYear(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getUnpaidInfo();
      }
    },
  },
  data: () => ({
    targetYear: new Date().toISOString().substr(0, 4),
    headers: [
      { text: "이름", align: "center", value: "name" },
      { text: "학년", align: "center", value: "grade" },
      { text: "총 미납금", align: "center", value: "total" },
      { text: "1월", align: "center", value: "january" },
      { text: "2월", align: "center", value: "february" },
      { text: "3월", align: "center", value: "march" },
      { text: "4월", align: "center", value: "april" },
      { text: "5월", align: "center", value: "may" },
      { text: "6월", align: "center", value: "june" },
      { text: "7월", align: "center", value: "july" },
      { text: "8월", align: "center", value: "august" },
      { text: "9월", align: "center", value: "september" },
      { text: "10월", align: "center", value: "october" },
      { text: "11월", align: "center", value: "november" },
      { text: "12월", align: "center", value: "december" },
    ],
    unpaid: [],
  }),
  computed: {
    years: {
      get() {
        var max = new Date().toISOString().substr(0, 4);
        var result = [];
        for (var year = 2018; year <= max; year++) {
          result.push(year.toString());
        }
        this.$forceUpdate();
        return result;
      },
    },
  },
  methods: {
    saveYear(val) {
      this.targetYear = String(val);
      this.$refs.yearMenu.save(this.targetYear);
      this.yearMenu = false;
    },
    getUnpaidInfo() {
      axios
        .get(
          "http://118.67.134.177:8080/bill/unpaid?targetYear=" +
            this.targetYear,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          this.unpaid = [];
          response.data.forEach((info) => {
            this.unpaid.push({
              name: enc.decryptValue(info.name),
              grade: info.grade,
              total: this.currencyFormat(info.total),
              january: this.currencyFormat(info.january),
              february: this.currencyFormat(info.february),
              march: this.currencyFormat(info.march),
              april: this.currencyFormat(info.april),
              may: this.currencyFormat(info.may),
              june: this.currencyFormat(info.june),
              july: this.currencyFormat(info.july),
              august: this.currencyFormat(info.august),
              september: this.currencyFormat(info.september),
              october: this.currencyFormat(info.october),
              november: this.currencyFormat(info.november),
              december: this.currencyFormat(info.december),
            });
          });
        });
    },
    currencyFormat(num) {
      var regexp = /\B(?=(\d{3})+(?!\d))/g;
      return num.toString().replace(regexp, ",");
    },
  },
};
</script>

<style scoped>
#add-input {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
.v-input /deep/ .v-select__selections {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  justify-content: center;
}
.v-input /deep/ .v-select__selection--comma {
  margin-left: 10px;
}
.v-select-list /deep/ .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
</style>
