<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">수납현황</p>
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
      <v-col cols="2">
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
      <v-col cols="2">
        <v-btn id="add-btn" small block @click="clickAddBillButton">
          <v-icon x-small class="mr-1">mdi-plus</v-icon>
          수강료 등록
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="bills"
      :search="search"
      :loading="loading"
      loading-text="수납 현황 정보를 불러오는 중입니다."
      disable-sort
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          id="action_btn_paid"
          class="elevation-0"
          small
          v-if="item.paidStatus !== '미납'"
          @click="clickPaidButton(item)"
        >
          수납
        </v-btn>
        <v-btn
          id="action_btn_unpaid"
          class="elevation-0"
          small
          v-else
          @click="clickPaidButton(item)"
        >
          수납
        </v-btn>
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
      <template v-slot:no-data>
        <p id="no-data">해당 기간에 입력된 수납정보가 없습니다.</p>
      </template>
    </v-data-table>
    <bill-upsert
      :showDialog.sync="showDialog"
      :target="selectStudentId"
      :targetMonth="targetMonth"
    />
    <bill-input :showInputDialog.sync="showInputDialog" />
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import BillUpsert from "./BillUpsert";
import BillInput from "./BillInput";

export default {
  components: {
    BillUpsert,
    BillInput,
  },
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
    showDialog(newVal) {
      if (!newVal) {
        this.loadBillList();
      }
    },
    showInputDialog(newVal) {
      if (!newVal) {
        this.loadBillList();
      }
    },
  },
  data: () => ({
    showDialog: false,
    showInputDialog: false,
    selectStudentId: "",
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
    loading: false,
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
      this.loading = true;
      axios
        .get("http://49.50.174.126:8080/bill?targetMonth=" + this.targetMonth, {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          this.bills.length = 0;
          response.data.forEach((billInfo) => {
            if (Number(billInfo.tuition) + Number(billInfo.bookPrice) > 0) {
              this.bills.push({
                studentId: billInfo.studentId,
                name: enc.decryptValue(billInfo.name),
                grade: billInfo.grade,
                tuition: billInfo.tuition,
                bookPrice: billInfo.bookPrice,
                totalPrice:
                  Number(billInfo.tuition) + Number(billInfo.bookPrice),
                paidStatus: this.checkPaidStatus(billInfo),
                unpaidBill: this.checkUnpaidBill(billInfo),
                depositDate: billInfo.depositDate,
                depositMethod: this.convertDepositMethod(
                  billInfo.depositMethod
                ),
              });
            }
          });
          this.bills.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          });
          this.loading = false;
        });
    },
    checkPaidStatus(billInfo) {
      const totalPrice = Number(billInfo.tuition) + Number(billInfo.bookPrice);
      if (totalPrice === billInfo.deposit) {
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
    clickPaidButton(item) {
      this.showDialog = true;
      this.selectStudentId = item.studentId;
    },
    clickAddBillButton() {
      this.showInputDialog = true;
    },
  },
};
</script>

<style scoped>
#add-btn {
  padding-left: 3%;
  padding-right: 3%;
  background-color: #00c089;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: white;
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
.v-data-table /deep/ #action_btn_paid {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  color: white;
  background-color: grey;
}
.v-data-table /deep/ #action_btn_unpaid {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  color: white;
  background-color: #ee534f;
}
</style>
