<template>
  <v-sheet height="350px" id="scroll">
    <v-row id="header">
      <v-col cols="3">
        <p id="h-label">이름</p>
      </v-col>
      <v-col cols="4">
        <p id="h-label">레벨</p>
      </v-col>
      <v-col cols="1">
        <p id="h-label">결석</p>
      </v-col>
      <v-col cols="1">
        <p id="h-label">A</p>
      </v-col>
      <v-col cols="1">
        <p id="h-label">H</p>
      </v-col>
      <v-col cols="1">
        <p id="h-label">P</p>
      </v-col>
      <v-col cols="1">
        <p id="h-label">M</p>
      </v-col>
    </v-row>
    <v-row v-for="(score, i) in scores" :key="i" align="end">
      <v-col cols="3" id="item">
        <p id="label">{{ score.name }}</p>
      </v-col>
      <v-col cols="2" id="select">
        <v-select
          id="add-input"
          :items="level_a"
          :disabled="score.absent"
          v-model="score.level_a"
          placeholder="결과"
          hide-details
        />
      </v-col>
      <v-col cols="2" id="select">
        <v-select
          id="add-input"
          :items="level_b"
          :disabled="score.absent"
          v-model="score.level_b"
          hide-details
        />
      </v-col>
      <v-col cols="1" id=box>
        <v-checkbox hide-details v-model="score.absent" small />
      </v-col>
      <v-col cols="1">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreA"
        />
      </v-col>
      <v-col cols="1">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreH"
        />
      </v-col>
      <v-col cols="1">
        <v-text-field
          id="score-input"
          hide-details
          type="number"
          :disabled="score.absent"
          v-model="score.scoreP"
        />
      </v-col>
      <v-col cols="1">
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
    scores: [],
  }),
  methods: {
    loadAttitudeData(targetDate) {
      axios
        .get(
          "http://118.67.134.177:8080/student/score/target?targetDate=" +
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
              name: this.getName(score.studentName, score.studentNameEn),
              level_a:
                score.lastLevel.slice(0, score.lastLevel.length - 3) !== ""
                  ? score.lastLevel.slice(0, score.lastLevel.length - 3)
                  : "B",
              level_b:
                score.lastLevel.slice(-3, score.lastLevel.length) !== ""
                  ? score.lastLevel.slice(-3, score.lastLevel.length)
                  : "1-1",
              absent: score.absent,
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
</style>
