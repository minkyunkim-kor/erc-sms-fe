<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p class="title">수납현황</p>
      </v-col>
    </v-row>
    <v-row align="baseline" justify="start" class="mt-0">
      <v-col cols="3">
        <v-text-field
          id="search"
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="search"
        />
      </v-col>
      <v-col cols="5">
        <v-spacer />
      </v-col>
      <v-col cols="3">
        <v-menu
          ref="dateMenu"
          v-model="dateMenu"
          :close-on-content-click="false"
          :return-value.sync="targetMonth"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="targetMonth"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              id="calendar"
              class="picker"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="targetMonth"
            type="month"
            no-title
            scrollable
            @change="saveTargetMonth"
          />
        </v-menu>
      </v-col>
      <v-col cols="1">
        <v-spacer />
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="bills"
      :search="search"
      disable-sort
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          id="action_btn"
          class="elevation-0"
          small
          v-if="item.paidStatus !== '완납'"
        >
          수납
        </v-btn>
        <v-btn id="action_btn" class="elevation-0" small v-else>수정</v-btn>
      </template>
      <template v-slot:[`item.tuition`]="{ item }">
        <div>
          {{ currencyFormat(item.tuition) }}
        </div>
      </template>
      <template v-slot:[`item.bookPrice`]="{ item }">
        <div>
          {{ currencyFormat(item.bookPrice) }}
        </div>
      </template>
      <template v-slot:[`item.totalPrice`]="{ item }">
        <div>
          {{ currencyFormat(item.totalPrice) }}
        </div>
      </template>
      <template v-slot:[`item.unpaidBill`]="{ item }">
        <div>
          {{ currencyFormat(item.unpaidBill) }}
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";

export default {
  created() {
    this.targetMonth = new Date();
    this.targetMonth = this.targetMonth.toISOString().substring(0, 7);
    this.loadBillList();
  },
  watch: {
    targetMonth(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadBillList();
      }
    },
  },
  data: () => ({
    search: "",
    dateMenu: false,
    targetMonth: "",
    bills: [],
    headers: [
      { text: "이름", align: "center", value: "name" },
      { text: "학년", align: "center", value: "grade", filterable: false },
      { align: "center", value: "actions", filterable: false },
      { text: "수강료", align: "center", value: "tuition", filterable: false },
      {
        text: "교재비",
        align: "center",
        value: "bookPrice",
        filterable: false,
      },
      {
        text: "총 금액",
        align: "center",
        value: "totalPrice",
        filterable: false,
      },
      { text: "상태", align: "center", value: "paidStatus", filterable: false },
      {
        text: "미납금",
        align: "center",
        value: "unpaidBill",
        filterable: false,
      },
      {
        text: "수납일",
        align: "center",
        value: "depositDate",
        filterable: false,
      },
      {
        text: "결제수단",
        align: "center",
        value: "depositMethod",
        filterable: false,
      },
    ],
  }),
  methods: {
    saveTargetMonth() {
      this.$refs.dateMenu.save(this.targetMonth);
      this.dateMenu = false;
    },
    currencyFormat(num) {
      var regexp = /\B(?=(\d{3})+(?!\d))/g;
      return num.toString().replace(regexp, ",");
    },
    loadBillList() {
      axios
        .get(
          "http://118.67.134.177:8080/bill?targetMonth=" + this.targetMonth,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          this.bills.length = 0;
          response.data.billInfo.forEach((billInfo) => {
            this.bills.push({
              studentId: billInfo.studentId,
              name: enc.decryptValue(billInfo.name),
              grade: billInfo.grade,
              tuition: billInfo.tuition,
              bookPrice: billInfo.bookPrice,
              totalPrice: Number(billInfo.tuition) + Number(billInfo.bookPrice),
              paidStatus: this.checkPaidStatus(billInfo),
              unpaidBill: this.checkUnpaidBill(billInfo),
              depositDate: billInfo.depositDate,
              depositMethod: this.convertDepositMethod(billInfo.depositMethod),
            });
          });
          this.bills.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          });
        });
    },
    checkPaidStatus(billInfo) {
      const totalPrice = Number(billInfo.tuition) + Number(billInfo.bookPrice);
      if (totalPrice === 0) {
        return "";
      } else if (totalPrice === billInfo.deposit) {
        return "완납";
      } else if (billInfo.deposit === 0) {
        return "미납";
      } else {
        return "부분납";
      }
    },
    checkUnpaidBill(billInfo) {
      const totalPrice = Number(billInfo.tuition) + Number(billInfo.bookPrice);
      return totalPrice - Number(billInfo.deposit);
    },
    convertDepositMethod(depositMethod) {
      if (depositMethod === "CARD") {
        return "카드";
      } else if (depositMethod === "CASH") {
        return "현금";
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped>
.v-application .title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 16px !important;
  color: #1c88e4 !important;
  font-weight: 800;
  margin-left: 10%;
  margin-bottom: 0px;
}
.v-input /deep/ #search {
  margin-left: 5%;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
.v-data-table /deep/ .action_btn {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  color: white;
}
</style>
