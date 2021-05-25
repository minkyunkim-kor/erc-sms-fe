<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">현금영수증 정보</p>
      </v-col>
    </v-row>
    <v-row align="baseline" justify="space-between" class="mt-0">
      <v-col cols="3">
        <v-text-field
          id="search"
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="search"
        />
      </v-col>
    </v-row>
    <v-row align="baseline" justify="space-between" class="mt-0">
      <v-col cols="12">
        <v-data-table
          id="add-component"
          :headers="headers"
          :items="cashReceipts"
          :search="search"
          :loading="loading"
          loading-text="현금영수증 정보를 불러오는 중입니다."
          disable-sort
          @dblclick:row="dblClickItem"
        />
      </v-col>
    </v-row>
    <cash-receipt-upsert
      :showDialog.sync="showDialog"
      :target="selectStudent"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import CashReceiptUpsert from "./CashReceiptUpsert";

export default {
  components: { CashReceiptUpsert },
  created() {
    this.loadCashReceiptInfo();
  },
  watch: {
    showDialog(newVal) {
      if (!newVal) {
        this.loadCashReceiptInfo();
      }
    },
  },
  data: () => ({
    showDialog: false,
    selectStudent: "",
    cashReceipts: [],
    headers: [
      { text: "이름", align: "center", value: "name" },
      { text: "학년", align: "center", value: "grade" },
      { text: "현금영수증 정보", align: "center", value: "cashReceipt" },
      { text: "비고", align: "center", value: "comment" },
    ],
    loading: false,
    search: "",
  }),
  methods: {
    loadCashReceiptInfo() {
      this.loading = true;
      this.cashReceipts.length = 0;
      axios
        .get("http://49.50.174.126:8080/bill/cashReceipt", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          response.data.forEach((item) => {
            this.cashReceipts.push({
              studentId: item.studentId,
              name: enc.decryptValue(item.name),
              grade: item.grade,
              cashReceipt:
                item.cashReceipt !== null
                  ? enc.decryptValue(item.cashReceipt)
                  : "",
              comment: item.comment,
            });
          });
          this.cashReceipts.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          });
          this.loading = false;
        });
    },
    dblClickItem(item, select) {
      this.selectStudent = select.item.studentId;
      this.showDialog = true;
    },
  },
};
</script>

<style scoped>
.v-input /deep/ #search {
  margin-left: 5%;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
</style>
