<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
    <v-card>
      <v-card-title id="card-upsert-title">레벨 테스트 정보 입력</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="details.name"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-cake-variant"
              v-model="details.grade"
              readonly
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col cols="4">
            <v-select
              id="add-input"
              prepend-icon="mdi-note-outline"
              :items="testLevels"
              v-model="details.testLevel"
              placeholder="테스트 레벨"
              hide-details
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              id="add-input"
              v-model="details.testScore"
              placeholder="점수"
              type="Number"
              hide-details
            />
          </v-col>
          <v-col cols="3">
            <v-select
              id="add-input"
              prepend-icon="mdi-star-circle-outline"
              :items="level_a"
              v-model="details.initLevelA"
              placeholder="결과"
              hide-details
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-if="checkLevelA_1(details.initLevelA)"
              id="add-input"
              :items="level_b_1"
              v-model="details.initLevelB"
              hide-details
            />
            <v-select
              v-else-if="checkLevelA_2(details.initLevelA)"
              id="add-input"
              :items="level_b_2"
              v-model="details.initLevelB"
              hide-details
            />
            <v-select
              v-else
              id="add-input"
              :items="level_b_3"
              v-model="details.initLevelB"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="baseline">
          <v-col cols="12">
            <v-textarea
              id="add-input"
              prepend-icon="mdi-lead-pencil"
              placeholder="메모"
              no-resize
              rows="3"
              clearable
              clear-icon="mdi-close-circle-outline"
              v-model="details.memo"
            />
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
  props: {
    showDialog: Boolean,
    target: String,
  },
  components: { ErrorPopup },
  watch: {
    showDialog(newVal) {
      if (newVal) {
        this.loadStudentLevelTestData();
      }
    },
  },
  data: () => ({
    testLevels: ["레벨1", "레벨2", "레벨3"],
    level_a: ["A", "B", "C", "PR", "D", "E", "F", "G", "H", "I", "J", "K"],
    level_b_1: [
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
    level_b_2: [
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
    ],
    level_b_3: ["1", "2", "3", "4", "5", "6", "7", "8"],
    isError: false,
    errorMessage: "",
    details: {},
  }),
  methods: {
    checkLevelA_1(levelA) {
      return (
        levelA === undefined ||
        ["A", "B", "C", "D", "E", "F", "H"].includes(levelA)
      );
    },
    checkLevelA_2(levelA) {
      return ["PR", "G"].includes(levelA);
    },
    loadStudentLevelTestData() {
      axios
        .get("http://49.50.174.126:8080/student/" + this.target + "/test", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          this.details = {
            id: response.data.studentId,
            name: this.getName(
              enc.decryptValue(response.data.nameKorean),
              response.data.nameEnglish
            ),
            grade: response.data.grade,
            initLevelA: response.data.initLevelA,
            initLevelB: response.data.initLevelB,
            testLevel: response.data.testLevel,
            testScore: response.data.testScore,
            memo: response.data.memo,
          };
        });
    },
    getName(name_ko, name_en) {
      return name_ko + "(" + name_en + ")";
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
          "http://49.50.174.126:8080/student/" + this.details.id + "/test",
          {
            initTestLevel: this.details.testLevel,
            initTestScore: this.details.testScore,
            initLevelA: this.details.initLevelA,
            initLevelB: this.details.initLevelB,
            memo: this.details.memo,
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
        this.details.testLevel !== undefined &&
        this.details.testLevel !== null &&
        this.details.testLevel.length > 0 &&
        (this.details.testScore === undefined ||
          this.details.testScore === null ||
          this.details.testScore.length === 0)
      ) {
        this.isError = true;
        this.errorMessage = "테스트 결과를 확인해주세요";
        return false;
      }
      if (
        this.details.testScore !== undefined &&
        this.details.testScore !== null &&
        this.details.testScore.length > 0 &&
        (this.details.testLevel === undefined ||
          this.details.testLevel === null ||
          this.details.testLevel.length === 0)
      ) {
        this.isError = true;
        this.errorMessage = "테스트 결과를 확인해주세요";
        return false;
      }
      if (
        this.details.initLevelA !== undefined &&
        this.details.initLevelA !== null &&
        this.details.initLevelA.length > 0 &&
        (this.details.initLevelB === undefined ||
          this.details.initLevelB === null ||
          this.details.initLevelB.length === 0)
      ) {
        this.isError = true;
        this.errorMessage = "시작 레벨을 확인해주세요";
        return false;
      }
      if (
        this.details.initLevelB !== undefined &&
        this.details.initLevelB !== null &&
        this.details.initLevelB.length > 0 &&
        (this.details.initLevelA === undefined ||
          this.details.initLevelA === null ||
          this.details.initLevelA.length === 0)
      ) {
        this.isError = true;
        this.errorMessage = "시작 레벨을 확인해주세요";
        return false;
      }
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
