<template>
  <v-dialog v-model="showDialog" persistent max-width="400px">
    <v-card>
      <v-card-title>레벨 테스트 정보 입력</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="target.name"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-cake-variant"
              v-model="target.grade"
              readonly
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="baseline">
          <v-col cols="6">
            <v-select
              id="add-input"
              :items="testLevels"
              v-model="target.testLevel"
              placeholder="테스트 레벨"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              v-model="target.testScore"
              placeholder="테스트 점수"
              type="Number"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="baseline">
          <v-col cols="6">
            <v-select
              id="add-input"
              :items="level_a"
              v-model="target.initLevelA"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-select
              id="add-input"
              :items="level_b"
              v-model="target.initLevelB"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row id="button-component" align="baseline">
          <v-spacer />
          <v-col cols="3">
            <v-btn block small @click="closeDialog">취소</v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn block small @click="clickSaveButton">저장</v-btn>
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
  props: {
    showDialog: Boolean,
    target: Object,
  },
  components: { ErrorPopup },
  data: () => ({
    testLevels: ["레벨1", "레벨2", "레벨3"],
    level_a: ["A", "B", "C", "PR", "D", "E", "F", "G", "H", "I", "J", "K"],
    level_b: [
      "1-1",
      "1-2",
      "2-1",
      "2-2",
      "3-1",
      "3-2",
      "4-1",
      "4-2",
      "5-1",
      "5-2",
      "6-1",
      "6-2",
      "7-1",
      "7-2",
      "8-1",
      "8-2",
    ],
    isError: false,
    errorMessage: "",
  }),
  methods: {
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    clickSaveButton() {
      if (!this.checkDataValidate()) {
        return;
      }
      axios
        .post(
          "http://118.67.134.177:8080/student/" + this.target.id + "/test",
          {
            initTestLevel: this.target.testLevel,
            initTestScore: this.target.testScore,
            initLevelA: this.target.initLevelA,
            initLevelB: this.target.initLevelB,
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
        this.target.testLevel === undefined ||
        this.target.testLevel.length === 0
      ) {
        this.isError = true;
        this.errorMessage = "테스트 레벨을 선택해주세요";
        return false;
      } else if (
        this.target.testScore === undefined ||
        this.target.testScore === null
      ) {
        this.isError = true;
        this.errorMessage = "테스트 점수을 입력해주세요";
        return false;
      } else if (this.target.testScore < 0 || this.target.testScore > 100) {
        this.isError = true;
        this.errorMessage = "올바른 테스트 점수을 입력해주세요";
        return false;
      } else if (
        this.target.initLevelA === undefined ||
        this.target.initLevelA.length === 0
      ) {
        this.isError = true;
        this.errorMessage = "최초 레벨을 선택해주세요";
        return false;
      } else if (
        this.target.initLevelB === undefined ||
        this.target.initLevelB.length === 0
      ) {
        this.isError = true;
        this.errorMessage = "최초 레벨을 선택해주세요";
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
.v-card .v-card__title {
  background-color: #00c089 !important;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 16px !important;
  color: white !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
#add-component {
  margin-top: 25px;
}
#button-component {
  margin-top: 25px;
}
.v-input /deep/ .v-label {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.v-input /deep/ .v-input__control {
  margin-left: 5px;
}
.v-input /deep/ #add-input {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.v-input /deep/ .v-select__selections {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.v-input /deep/ .v-select__selection--comma {
  margin-left: 10px;
}
.v-select-list /deep/ .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
</style>
