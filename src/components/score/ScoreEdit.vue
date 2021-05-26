<template>
  <v-dialog v-model="showEditDialog" persistent max-width="520px">
    <v-card>
      <v-card-title id="card-edit-title">평가 데이터 수정</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="end">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="selected.name"
              placeholder="한글 이름"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="3">
            <v-select
              id="add-input"
              prepend-icon="mdi-star-circle-outline"
              :items="level_a"
              v-model="selected.level_a"
              placeholder="결과"
              hide-details
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-if="checkLevelA_1(selected.level_a)"
              id="add-input"
              :items="level_b_1"
              v-model="selected.level_b"
              hide-details
            />
            <v-select
              v-else-if="checkLevelA_2(selected.level_a)"
              id="add-input"
              :items="level_b_2"
              v-model="selected.level_b"
              hide-details
            />
            <v-select
              v-else
              id="add-input"
              :items="level_b_3"
              v-model="selected.level_b"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row class="">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-home-variant-outline"
              v-model="selected.teacher"
              placeholder="담당 선생님"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              :return-value.sync="selected.targetDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  id="add-input"
                  v-model="selected.targetDate"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  placeholder="수업일"
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="selected.targetDate"
                :max="new Date().toISOString().substr(0, 10)"
                no-title
                scrollable
                @change="saveTargetDate"
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row align="baseline">
          <v-col cols="1">
            <v-icon>mdi-numeric-1-circle</v-icon>
          </v-col>
          <v-col cols="3">
            <p id="label">태도평가</p>
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreA"
              label="Attendance"
              type="Number"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreH"
              label="Homework"
              type="Number"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row justify="end" class="">
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreP"
              label="Participation"
              type="Number"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreM"
              label="Manner"
              type="Number"
              hide-details
            />
          </v-col>
        </v-row>

        <v-row align="baseline">
          <v-col cols="1">
            <v-icon>mdi-numeric-2-circle</v-icon>
          </v-col>
          <v-col cols="3">
            <p id="label">학습평가</p>
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreD"
              label="Decoding"
              type="Number"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreOF"
              label="fluency"
              type="Number"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row justify="end" class="">
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreC"
              label="Comprehension"
              type="Number"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreG"
              label="Grammar"
              type="Number"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row justify="end" class="">
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreS"
              label="Speaking"
              type="Number"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              class="mt-0 pt-0"
              v-model="selected.scoreW"
              label="Writing"
              type="Number"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row justify="start">
          <v-col cols="1">
            <v-icon>mdi-numeric-3-circle</v-icon>
          </v-col>
          <v-col cols="3">
            <p id="label">주관평가</p>
          </v-col>
          <v-col cols="8">
            <v-textarea
              id="add-input"
              placeholder="COMMENT"
              outlined
              no-resize
              rows="3"
              clearable
              clear-icon="mdi-close-circle-outline"
              v-model="selected.comment"
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
            <v-btn id="btn-remove" block small @click="clickRemoveButton">
              삭제
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
    <remove-alert
      :showDialog.sync="removeDialog"
      :confirmRemove.sync="confirmRemove"
      component="score"
      :target="selected.studentId"
      :targetDate="selected.targetDate"
    />
  </v-dialog>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import ErrorPopup from "../popup/ErrorPopup";
import RemoveAlert from "../popup/RemoveAlert";

export default {
  components: {
    ErrorPopup,
    RemoveAlert,
  },
  props: {
    showEditDialog: Boolean,
    selectedId: String,
    targetDate: String,
  },
  watch: {
    showEditDialog(newVal) {
      if (newVal) {
        this.confirmRemove = false;
        this.loadManualTarget();
      }
    },
    confirmRemove: function (newVal) {
      if (newVal) {
        this.closeDialog();
      }
    },
  },
  data: () => ({
    dateMenu: false,
    selected: {},
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
    removeDialog: false,
    confirmRemove: false,
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
    saveTargetDate(date) {
      this.$refs.dateMenu.save(date);
    },
    closeDialog() {
      this.$emit("update:showEditDialog", false);
    },
    loadManualTarget() {
      axios
        .get(
          "http://49.50.174.126:8080/student/" +
            this.selectedId +
            "/score?targetDate=" +
            this.targetDate,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          this.selected = {
            studentId: response.data.studentId,
            studentScoreId: response.data.studentScoreId,
            name: enc.decryptValue(response.data.name),
            targetDate: response.data.lessonDate,
            level_a:
              response.data.lessonLevel.length > 2
                ? response.data.lessonLevel.slice(
                    0,
                    response.data.lessonLevel.length - 3
                  )
                : response.data.lessonLevel.length === 2
                ? response.data.lessonLevel.slice(0, 1)
                : "",
            level_b:
              response.data.lessonLevel.length > 2
                ? response.data.lessonLevel.slice(
                    -3,
                    response.data.lessonLevel.length
                  )
                : response.data.lessonLevel.length === 2
                ? response.data.lessonLevel.slice(1, 2)
                : "1-1",
            scoreA: response.data.scoreA,
            scoreH: response.data.scoreH,
            scoreP: response.data.scoreP,
            scoreM: response.data.scoreM,
            scoreD: response.data.scoreD,
            scoreOF: response.data.scoreOF,
            scoreC: response.data.scoreC,
            scoreG: response.data.scoreG,
            scoreW: response.data.scoreW,
            scoreS: response.data.scoreS,
            teacher:
              response.data.teacher !== "" && response.data.teacher !== null
                ? enc.decryptValue(response.data.teacher)
                : "",
            comment: response.data.comment,
          };
        });
    },
    validateData() {
      if (this.selected.targetDate === null) {
        this.isError = true;
        this.errorMessage = "수업일을 입력해주세요";
        return false;
      } else if (!this.validateAttitudeData(this.selected.scoreA)) {
        this.isError = true;
        this.errorMessage = "Attendance 값을 확인하세요.";
        return false;
      } else if (!this.validateAttitudeData(this.selected.scoreH)) {
        this.isError = true;
        this.errorMessage = "Homework 값을 확인하세요.";
        return false;
      } else if (!this.validateAttitudeData(this.selected.scoreP)) {
        this.isError = true;
        this.errorMessage = "Participation 값을 확인하세요.";
        return false;
      } else if (!this.validateAttitudeData(this.selected.scoreM)) {
        this.isError = true;
        this.errorMessage = "Manner 값을 확인하세요.";
        return false;
      } else if (!this.validateLearningData(this.selected.scoreD)) {
        this.isError = true;
        this.errorMessage = "Decoding 값을 확인하세요.";
        return false;
      } else if (!this.validateLearningData(this.selected.scoreOF)) {
        this.isError = true;
        this.errorMessage = "Fluency 값을 확인하세요.";
        return false;
      } else if (!this.validateLearningData(this.selected.scoreC)) {
        this.isError = true;
        this.errorMessage = "Comprehension 값을 확인하세요.";
        return false;
      } else if (!this.validateLearningData(this.selected.scoreG)) {
        this.isError = true;
        this.errorMessage = "Grammar 값을 확인하세요.";
        return false;
      } else if (!this.validateLearningData(this.selected.scoreS)) {
        this.isError = true;
        this.errorMessage = "Speaking 값을 확인하세요.";
        return false;
      } else if (!this.validateLearningData(this.selected.scoreW)) {
        this.isError = true;
        this.errorMessage = "Writing 값을 확인하세요.";
        return false;
      } else {
        return true;
      }
    },
    validateAttitudeData(score) {
      return null !== score && score !== "" && 1 <= score && score <= 5;
    },
    validateLearningData(score) {
      return null !== score && score !== "" && 0 <= score && score <= 5;
    },
    clickSaveButton() {
      if (!this.validateData()) {
        return;
      }
      if (this.targetDate !== this.selected.targetDate) {
        this.removeScore();
      }
      axios
        .post(
          "http://49.50.174.126:8080/student/score",
          {
            targetDate: this.selected.targetDate,
            input: [
              {
                studentId: this.selected.studentId,
                attitude: {
                  lessonLevel: this.selected.level_a + this.selected.level_b,
                  absent: false,
                  attendance: this.selected.scoreA,
                  homework: this.selected.scoreH,
                  participation: this.selected.scoreP,
                  manner: this.selected.scoreM,
                },
                learning: {
                  decoding: this.selected.scoreD,
                  fluency: this.selected.scoreOF,
                  comprehension: this.selected.scoreC,
                  grammar: this.selected.scoreG,
                  writing: this.selected.scoreW,
                  speaking: this.selected.scoreS,
                },
                extra: {
                  teacher: enc.encryptValue(this.selected.teacher),
                  comment: this.selected.comment,
                  completed: true,
                },
              },
            ],
          },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then(() => this.closeDialog());
    },
    clickRemoveButton() {
      this.removeDialog = true;
    },
    removeScore() {
      axios.delete(
        "http://49.50.174.126:8080/student/score?studentId=" +
          this.selectedId +
          "&targetDate=" +
          this.targetDate,
        {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        }
      );
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
  margin-bottom: 0px;
}
.v-text-field /deep/ .v-label {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
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
  margin-top: 0px;
  margin-left: 10px;
  margin-bottom: 0px;
}
.v-text-field--placeholder {
  margin-top: 0px;
  padding-top: 0px;
}
.v-select-list /deep/ .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
.v-input >>> input::-webkit-outer-spin-button,
.v-input >>> input::-webkit-inner-spin-button {
  /* Text Field Number 항목 arrow 버튼 제거 */
  -webkit-appearance: none;
}
</style>
