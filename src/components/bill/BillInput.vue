<template>
  <v-dialog v-model="showInputDialog" persistent max-width="900px">
    <v-card>
      <v-card-title id="card-input-title">수강료 입력</v-card-title>
      <v-card-text>
        <v-row id="add-component">
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
                  hide-details
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
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-sheet height="400px" id="scroll">
              <v-row id="header">
                <v-col cols="2">
                  <p id="h-label">이름</p>
                </v-col>
                <v-col cols="1">
                  <p id="h-label">학년</p>
                </v-col>
                <v-col cols="2">
                  <p id="h-label">수강료</p>
                </v-col>
                <v-col cols="2">
                  <p id="h-label">교재비</p>
                </v-col>
                <v-col cols="2">
                  <p id="h-label">총 금액</p>
                </v-col>
                <v-col cols="3">
                  <p id="h-label">비고</p>
                </v-col>
              </v-row>
              <v-row v-for="(bill, i) in bills" :key="i" align="baseline">
                <v-col id="item" cols="2">
                  <p id="label">{{ bill.name }}</p>
                </v-col>
                <v-col id="item" cols="1">
                  <p id="label">{{ bill.grade }}</p>
                </v-col>
                <v-col id="item" cols="2">
                  <v-text-field
                    id="add-input"
                    v-model="bill.tuition"
                    type="number"
                    hide-details
                  />
                </v-col>
                <v-col id="item" cols="2">
                  <v-text-field
                    id="add-input"
                    v-model="bill.bookPrice"
                    type="number"
                    hide-details
                  />
                </v-col>
                <v-col id="item" cols="2">
                  <p id="label">
                    {{ currencyFormat(calculateTotalPrice(bill)) }}
                  </p>
                </v-col>
                <v-col id="item" cols="3">
                  <v-text-field
                    id="add-comment"
                    v-model="bill.comment"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row id="button-component" align="baseline">
          <v-spacer />
          <v-col cols="2">
            <v-btn id="btn-cancel" block small @click="closeDialog">
              취소
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn id="btn-save" block small @click="clickSaveButton">
              저장
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <error-popup :showDialog.sync="isError" :errorMessage="errorMessage" />
  </v-dialog>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import ErrorPopup from "../popup/ErrorPopup";

export default {
  components: {
    ErrorPopup,
  },
  props: {
    showInputDialog: Boolean,
  },
  created() {
    this.targetMonth = new Date();
    this.targetMonth = this.targetMonth.toISOString().substring(0, 7);
    this.loadBillList();
  },
  watch: {
    showInputDialog(newVal) {
      if (newVal) {
        this.loadBillList();
      }
    },
    targetMonth(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadBillList();
      }
    },
  },
  data: () => ({
    dateMenu: false,
    targetMonth: "",
    bills: [],
    isError: false,
    errorMessage: "",
  }),
  methods: {
    saveTargetMonth() {
      this.$refs.dateMenu.save(this.targetMonth);
      this.dateMenu = false;
    },
    loadBillList() {
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
            this.bills.push({
              studentId: billInfo.studentId,
              name: enc.decryptValue(billInfo.name),
              grade: billInfo.grade,
              tuition: billInfo.tuition,
              bookPrice: billInfo.bookPrice,
              comment: billInfo.comment,
            });
          });
          this.bills.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          });
        });
    },
    calculateTotalPrice(item) {
      return Number(item.tuition) + Number(item.bookPrice);
    },
    currencyFormat(num) {
      var regexp = /\B(?=(\d{3})+(?!\d))/g;
      return num.toString().replace(regexp, ",");
    },
    closeDialog() {
      this.$emit("update:showInputDialog", false);
    },
    clickSaveButton() {
      if (!this.checkDataValidate()) {
        return;
      }
      var req = { targetMonth: this.targetMonth, billData: [] };
      this.bills.forEach((item) => {
        req.billData.push({
          studentId: item.studentId,
          tuition: item.tuition,
          bookPrice: item.bookPrice,
          comment: item.comment,
        });
      });
      axios
        .post("http://49.50.174.126:8080/bill", req, {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then(() => this.$emit("update:showInputDialog", false));
    },
    checkDataValidate() {
      this.bills.forEach((item) => {
        if (item.tuition < 0) {
          this.isError = true;
          this.errorMessage = item.name + " 학생의 수강료를 확인해주세요.";
          return false;
        } else if (item.bookPrice < 0) {
          this.isError = true;
          this.errorMessage = item.name + " 학생의 교재비를 확인해주세요.";
          return false;
        }
      });
      return true;
    },
  },
};
</script>

<style scoped>
#add-component {
  margin-top: 25px;
}
#button-component {
  margin-top: 25px;
}
#h-label {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0px;
}
#label {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  text-align: center;
  margin-bottom: 0px;
}
#header {
  border-top: 1px solid;
  border-bottom: 1px solid;
}
#item {
  padding-top: 0px;
  padding-bottom: 0px;
}
.v-card #scroll {
  overflow-y: scroll;
  overflow-x: hidden;
}
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
.v-input /deep/ #add-input {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
.v-input /deep/ #add-comment {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.v-input >>> input::-webkit-outer-spin-button,
.v-input >>> input::-webkit-inner-spin-button {
  /* Text Field Number 항목 arrow 버튼 제거 */
  -webkit-appearance: none;
}
</style>
