<template>
  <v-dialog v-model="showDialog" persistent max-width="400px">
    <v-card>
      <v-card-title id="card-upsert-title">
        현금영수정 정보 입력/수정
      </v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="2">
            <p id="label">이름 :</p>
          </v-col>
          <v-col cols="4">
            <p id="label">{{ details.name }}</p>
          </v-col>
          <v-col cols="2">
            <p id="label">학년 :</p>
          </v-col>
          <v-col cols="4">
            <p id="label">{{ details.grade }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              id="add-input"
              v-model="details.cashReceipt"
              hide-details
              prepend-icon="mdi-phone"
              placeholder="현금영수증 정보"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              id="add-input"
              prepend-icon="mdi-lead-pencil"
              placeholder="비고"
              no-resize
              rows="3"
              clearable
              clear-icon="mdi-close-circle-outline"
              v-model="details.comment"
            />
          </v-col>
        </v-row>
        <v-row id="button-component" align="baseline">
          <v-spacer />
          <v-col cols="3">
            <v-btn id="btn-cancel" block small @click="closeDialog">
              취소
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn id="btn-save" block small @click="clickSaveButton">
              저장
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";

export default {
  props: {
    showDialog: Boolean,
    target: String,
  },
  watch: {
    showDialog(newVal) {
      if (newVal) {
        this.loadCashReceiptInfo();
      }
    },
  },
  data: () => ({
    details: {},
  }),
  methods: {
    loadCashReceiptInfo() {
      axios
        .get("http://49.50.174.126:8080/bill/" + this.target + "/cashReceipt", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          this.details = {};
          this.details.studentId = response.data.studentId;
          this.details.name = enc.decryptValue(response.data.name);
          this.details.grade = response.data.grade;
          this.details.cashReceipt =
            response.data.cashReceipt !== null
              ? enc.decryptValue(response.data.cashReceipt)
              : "";
          this.details.comment = response.data.comment;
        });
    },
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    clickSaveButton() {
      axios
        .post(
          "http://49.50.174.126:8080/bill/cashReceipt",
          {
            studentId: this.target,
            cashReceipt: enc.encryptValue(this.details.cashReceipt),
            comment: this.details.comment,
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
.v-input /deep/ #add-input {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
</style>
