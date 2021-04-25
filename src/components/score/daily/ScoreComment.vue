<template>
  <v-sheet height="350px" id="scroll">
    <v-row id="header">
      <v-col cols="20p">
        <p id="h-label">이름</p>
      </v-col>
      <v-col cols="20p">
        <p id="h-label">레벨</p>
      </v-col>
      <v-col cols="40p">
        <p id="h-label">COMMENT</p>
      </v-col>
      <v-col cols="20p">
        <p id="h-label">담당 선생님</p>
      </v-col>
    </v-row>
    <v-row v-for="(score, i) in scores" :key="i" align="end">
      <v-col cols="20p" id="item">
        <p id="label">{{ score.name }}</p>
      </v-col>
      <v-col cols="20p" id="item">
        <p id="label">{{ score.level }}</p>
      </v-col>
      <v-col cols="40p">
        <v-text-field
          id="score-input"
          hide-details
          :disabled="score.absent"
          v-model="score.comment"
        />
      </v-col>
      <v-col cols="20p" id="item">
        <p id="label">{{ score.teacher }}</p>
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
    loadCommentData(targetDate) {
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
              studentId: score.studentId,
              name: this.getName(score.studentName, score.studentNameEn),
              level: score.lastLevel !== "" ? score.lastLevel : "B1-1",
              absent: score.absent,
              teacher: enc.decryptValue(score.teacher),
              comment: score.comment,
            });
          });
        });
    },
    getName(name, nameEn) {
      return enc.decryptValue(name) + "(" + nameEn + ")";
    },
    getSaveCommentDataRequest(targetDate) {
      var req = { targetDate: targetDate, input: [] };
      this.scores.forEach((item) => {
        req.input.push({
          studentId: item.studentId,
          extra: {
            teacher: enc.encryptValue(item.teacher),
            comment: item.comment,
          },
        });
      });
      return req;
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
.v-input /deep/ #add-inputarea {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.col-20p {
  flex: 0 0 20%;
  max-width: 20%;
}
.col-40p {
  flex: 0 0 40%;
  max-width: 40%;
}
</style>
