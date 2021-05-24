<template>
  <v-sheet height="350px" id="scroll">
    <v-row id="header">
      <v-col cols="20p">
        <p id="h-label">이름</p>
      </v-col>
      <v-col cols="20p">
        <p id="h-label">레벨</p>
      </v-col>
      <v-col cols="12p">
        <p id="h-label">결석</p>
      </v-col>
      <v-col cols="12p">
        <p id="h-label">A</p>
      </v-col>
      <v-col cols="12p">
        <p id="h-label">H</p>
      </v-col>
      <v-col cols="12p">
        <p id="h-label">P</p>
      </v-col>
      <v-col cols="12p">
        <p id="h-label">M</p>
      </v-col>
    </v-row>
    <v-row v-for="(score, i) in scores" :key="i" align="end">
      <v-col cols="20p" id="item">
        <p id="label">{{ score.name }}</p>
      </v-col>
      <v-col cols="10p" id="select">
        <v-select
          id="add-input"
          :items="level_a"
          :disabled="score.absent"
          v-model="score.level_a"
          placeholder="결과"
          hide-details
        />
      </v-col>
      <v-col cols="10p" id="select">
        <v-select
          v-if="checkLevelA_1(score.level_a)"
          id="add-input"
          :items="level_b_1"
          :disabled="score.absent"
          v-model="score.level_b"
          hide-details
        />
        <v-select
          v-else-if="checkLevelA_2(score.level_a)"
          id="add-input"
          :items="level_b_2"
          :disabled="score.absent"
          v-model="score.level_b"
          hide-details
        />
        <v-select
          v-else
          id="add-input"
          :items="level_b_3"
          :disabled="score.absent"
          v-model="score.level_b"
          hide-details
        />
      </v-col>
      <v-col cols="12p" id="box">
        <v-checkbox hide-details v-model="score.absent" small />
      </v-col>
      <v-col cols="12p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreA"
        />
      </v-col>
      <v-col cols="12p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreH"
        />
      </v-col>
      <v-col cols="12p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreP"
        />
      </v-col>
      <v-col cols="12p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreM"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import axios from "axios";
import enc from "../../util/enc";

export default {
  data: () => ({
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
    scores: [],
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
    initData() {
      this.scores = [];
    },
    loadAttitudeData(targetDate) {
      axios
        .get(
          "http://49.50.174.126:8080/student/score/target?targetDate=" +
            targetDate,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          this.scores = [];
          response.data.forEach((score) => {
            this.scores.push({
              studentId: score.studentId,
              name: this.getName(score.studentName, score.studentNameEn),
              level_a:
                score.lastLevel.length > 2
                  ? score.lastLevel.slice(0, score.lastLevel.length - 3)
                  : score.lastLevel.length === 2
                  ? score.lastLevel.slice(0, 1)
                  : "B",
              level_b:
                score.lastLevel.length > 2
                  ? score.lastLevel.slice(-3, score.lastLevel.length)
                  : score.lastLevel.length === 2
                  ? score.lastLevel.slice(1, 2)
                  : "1-1",
              absent: score.absent === null ? false : score.absent,
              scoreA: score.scoreA,
              scoreH: score.scoreH,
              scoreP: score.scoreP,
              scoreM: score.scoreM,
            });
          });
        });
    },
    getName(name, nameEn) {
      return enc.decryptValue(name) + "(" + nameEn + ")";
    },
    getSaveAttitudeDataRequest(targetDate) {
      var valid = this.validateAttitudeScore();
      if (valid.isError) {
        return valid;
      }
      var req = { targetDate: targetDate, input: [], isError: false };
      this.scores.forEach((item) => {
        req.input.push({
          studentId: item.studentId,
          attitude: {
            lessonLevel: item.level_a + item.level_b,
            absent: item.absent,
            attendance: item.scoreA,
            homework: item.scoreH,
            participation: item.scoreP,
            manner: item.scoreM,
          },
        });
      });
      return req;
    },
    validateAttitudeScore() {
      var result = { isError: false };
      this.scores.forEach((score) => {
        if (!score.absent) {
          if (!this.scoreValidate(score.scoreA)) {
            result = { isError: true, message: score.name };
          } else if (!this.scoreValidate(score.scoreH)) {
            result = { isError: true, message: score.name };
          } else if (!this.scoreValidate(score.scoreP)) {
            result = { isError: true, message: score.name };
          } else if (!this.scoreValidate(score.scoreM)) {
            result = { isError: true, message: score.name };
          }
        }
      });
      return result;
    },
    scoreValidate(score) {
      return score !== null && 1 <= score && score <= 5;
    },
  },
};
</script>

<style scoped>
.v-card #scroll {
  overflow-y: scroll;
  overflow-x: hidden;
}
#h-label {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  font-weight: 800;
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
#box {
  padding: 10px;
}
#select {
  padding-top: 6px;
  padding-bottom: 6px;
  padding-right: 4px;
  padding-left: 4px;
}
#label {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 13px;
  text-align: center;
  margin-bottom: 0px;
  padding: 12px;
}
.v-select {
  margin-top: 0px;
  padding-top: 0px;
}
.v-input--checkbox {
  margin-top: 0px;
  padding-top: 0px;
}
.v-input /deep/ #score-input {
  padding-top: 0px;
  padding-bottom: 0px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
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
.v-select-list /deep/ .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
.v-input /deep/ .v-input__slot {
  display: flex;
  justify-content: center;
}
.v-text-field {
  margin-top: 0px;
  padding-top: 0px;
}
.v-input /deep/ .v-input--selection-controls__input {
  margin-right: 0px;
}
.v-input >>> input::-webkit-outer-spin-button,
.v-input >>> input::-webkit-inner-spin-button {
  /* Text Field Number 항목 arrow 버튼 제거 */
  -webkit-appearance: none;
}
.col-10p {
  flex: 0 0 10%;
  max-width: 10%;
}
.col-12p {
  flex: 0 0 12%;
  max-width: 12%;
}
.col-20p {
  flex: 0 0 20%;
  max-width: 20%;
}
</style>
