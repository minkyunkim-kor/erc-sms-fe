<template>
  <v-dialog v-model="showDialog" persistent max-width="400px">
    <v-card>
      <v-card-title id="card-upsert-title">수납 입력/수정</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="1">
            <v-spacer />
          </v-col>
          <v-col cols="3">
            <span id="label">총 금액</span>
          </v-col>
          <v-col cols="7">
            <v-text-field
              id="add-input"
              v-model="bills.totalPrice"
              type="Number"
              hide-details
              readonly
            />
          </v-col>
        </v-row>
        <v-row align="baseline" class="mt-0">
          <v-col cols="1">
            <v-spacer />
          </v-col>
          <v-col cols="3">
            <span id="label">입금액</span>
          </v-col>
          <v-col cols="7">
            <v-text-field
              id="add-input"
              v-model="bills.deposit"
              type="Number"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="baseline" class="mt-0">
          <v-col cols="1">
            <v-spacer />
          </v-col>
          <v-col cols="3">
            <span id="label">잔액</span>
          </v-col>
          <v-col cols="7">
            <v-text-field
              id="add-input"
              v-model="unpaidBill"
              type="Number"
              hide-details
              readonly
            />
          </v-col>
        </v-row>
        <v-row align="baseline" class="mt-0">
          <v-col cols="1">
            <v-spacer />
          </v-col>
          <v-col cols="3">
            <span id="label">미납액</span>
          </v-col>
          <v-col cols="7">
            <v-text-field
              id="add-input"
              v-model="unpaidBill"
              type="Number"
              hide-details
              readonly
            />
          </v-col>
        </v-row>
        <v-row align="baseline" class="mt-0">
          <v-col cols="1">
            <v-spacer />
          </v-col>
          <v-col cols="3">
            <span id="label">입금일</span>
          </v-col>
          <v-col cols="7">
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              :return-value.sync="bills.depositDate"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="bills.depositDate"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hide-details
                  id="calendar"
                  class="picker"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="bills.depositDate"
                no-title
                scrollable
                @change="saveDepositDate"
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row align="baseline" class="mt-0">
          <v-col cols="1">
            <v-spacer />
          </v-col>
          <v-col cols="3">
            <span id="label">결제수단</span>
          </v-col>
          <v-col cols="7" class="flex-center">
            <v-radio-group v-model="bills.depositMethod" row hide-details>
              <v-radio label="카드" value="CARD"></v-radio>
              <v-radio label="현금" value="CASH"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row align="baseline" class="mt-0">
          <v-col cols="1">
            <v-spacer />
          </v-col>
          <v-col cols="10">
            <v-textarea
              id="add-inputarea"
              placeholder="비고"
              no-resize
              rows="3"
              clearable
              clear-icon="mdi-close-circle-outline"
              outlined
              v-model="bills.comment"
            />
          </v-col>
        </v-row>
        <v-row id="button-component" align="baseline">
          <v-spacer />
          <v-col cols="3">
            <v-btn block small @click="closeDialog">취소</v-btn>
          </v-col>
          <v-col cols="3">
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
import ErrorPopup from "../popup/ErrorPopup";

export default {
  components: { ErrorPopup },
  props: {
    showDialog: Boolean,
    target: String,
    targetMonth: String,
  },
  watch: {
    showDialog(newVal) {
      if (newVal) {
        this.loadBillData();
      }
    },
  },
  data: () => ({
    bills: {},
    dateMenu: false,
    isError: false,
    errorMessage: "",
  }),
  computed: {
    unpaidBill: {
      get() {
        return Number(this.bills.totalPrice) - Number(this.bills.deposit);
      },
    },
  },
  methods: {
    loadBillData() {
      axios
        .get(
          "http://118.67.134.177:8080/bill/" +
            this.target +
            "?targetMonth=" +
            this.targetMonth,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          this.bills = {
            studentId: response.data.studentId,
            totalPrice:
              Number(response.data.tuition) + Number(response.data.bookPrice),
            deposit: response.data.deposit,
            depositDate:
              response.data.depositDate === ""
                ? new Date().toISOString().substring(0, 10)
                : response.data.depositDate,
            depositMethod: response.data.depositMethod,
            comment: response.data.comment,
          };
        });
    },
    saveDepositDate() {
      this.$refs.dateMenu.save(this.bills.depositDate);
      this.dateMenu = false;
    },
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    clickSaveButton() {
      if (!this.checkDataValidate()) {
        return;
      }
      axios
        .post(
          "http://118.67.134.177:8080/bill/payment",
          {
            studentId: this.target,
            targetMonth: this.targetMonth,
            deposit: this.bills.deposit,
            depositDate: this.bills.depositDate,
            depositMethod: this.bills.depositMethod,
            comment: this.bills.comment,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then(() => this.$emit("update:showDialog", false));
    },
    checkDataValidate() {
      if (
        this.bills.deposit < 0 ||
        this.bills.deposit > this.bills.totalPrice
      ) {
        this.isError = true;
        this.errorMessage = "입금액을 잘못 입력하셨습니다.";
        return false;
      } else if (this.bills.depositMethod === "") {
        this.isError = true;
        this.errorMessage = "결제수단을 선택해주세요.";
        return false;
      } else {
        return true;
      }
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
#label {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  text-align: center;
}
.v-input /deep/ .v-input__prepend-outer {
  margin-right: 0px;
}
.v-input /deep/ .v-input__control {
  margin-left: 5px;
}
.v-input /deep/ #add-input {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
.v-input /deep/ #add-inputarea {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.v-input /deep/ .v-label {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
