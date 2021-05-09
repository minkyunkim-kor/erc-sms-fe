<template>
  <v-sheet height="350px" id="scroll">
    <v-row id="header">
      <v-col cols="20p">
        <p id="h-label">이름</p>
      </v-col>
      <v-col cols="20p">
        <p id="h-label">레벨</p>
      </v-col>
      <v-col cols="10p">
        <p id="h-label">D</p>
      </v-col>
      <v-col cols="10p">
        <p id="h-label">OF</p>
      </v-col>
      <v-col cols="10p">
        <p id="h-label">C</p>
      </v-col>
      <v-col cols="10p">
        <p id="h-label">G</p>
      </v-col>
      <v-col cols="10p">
        <p id="h-label">W</p>
      </v-col>
      <v-col cols="10p">
        <p id="h-label">S</p>
      </v-col>
    </v-row>
    <v-row v-for="(score, i) in scores" :key="i" align="end" height="56px">
      <v-col cols="20p" id="item">
        <p id="label">{{ score.name }}</p>
      </v-col>
      <v-col cols="20p" id="item">
        <p id="label">{{ score.level }}</p>
      </v-col>
      <v-col cols="10p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreD"
        />
      </v-col>
      <v-col cols="10p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreOF"
        />
      </v-col>
      <v-col cols="10p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreC"
        />
      </v-col>
      <v-col cols="10p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreG"
        />
      </v-col>
      <v-col cols="10p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreW"
        />
      </v-col>
      <v-col cols="10p">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreS"
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
    scores: [],
  }),
  methods: {
    loadLearningData(targetDate) {
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
          response.data.targets.forEach((score) => {
            this.scores.push({
              studentId: score.studentId,
              name: this.getName(score.studentName, score.studentNameEn),
              level: score.lastLevel !== "" ? score.lastLevel : "B1-1",
              absent: score.absent,
              scoreD: score.scoreD,
              scoreOF: score.scoreOF,
              scoreC: score.scoreC,
              scoreG: score.scoreG,
              scoreW: score.scoreW,
              scoreS: score.scoreS,
            });
          });
        });
    },
    getName(name, nameEn) {
      return enc.decryptValue(name) + "(" + nameEn + ")";
    },
    getSaveLearningDataRequest(targetDate) {
      var valid = this.validateLearningScore();
      if (valid.isError) {
        return valid;
      }
      var req = { targetDate: targetDate, input: [] };
      this.scores.forEach((item) => {
        req.input.push({
          studentId: item.studentId,
          learning: {
            decoding: item.scoreD,
            fluency: item.scoreOF,
            comprehension: item.scoreC,
            grammar: item.scoreG,
            writing: item.scoreW,
            speaking: item.scoreS,
          },
        });
      });
      return req;
    },
    validateLearningScore() {
      var result = { isError: false };
      this.scores.forEach((score) => {
        if (!this.scoreValidate(score.scoreD)) {
          result = { isError: true, message: score.name };
        } else if (!this.scoreValidate(score.scoreOF)) {
          result = { isError: true, message: score.name };
        } else if (!this.scoreValidate(score.scoreC)) {
          result = { isError: true, message: score.name };
        } else if (!this.scoreValidate(score.scoreG)) {
          result = { isError: true, message: score.name };
        } else if (!this.scoreValidate(score.scoreW)) {
          result = { isError: true, message: score.name };
        } else if (!this.scoreValidate(score.scoreS)) {
          result = { isError: true, message: score.name };
        }
      });
      return result;
    },
    scoreValidate(score) {
      return score === null || (0 <= score && score <= 5);
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
.col-20p {
  flex: 0 0 20%;
  max-width: 20%;
}
</style>
