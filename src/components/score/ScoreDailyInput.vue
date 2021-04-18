<template>
  <v-dialog v-model="showDailyInputDilog" persistent max-width="900px">
    <v-card>
      <v-card-title id="card-input-title">일별 평가 데이터 입력</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="3">
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              :return-value.sync="targetDate"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="targetDate"
                  prepend-icon="mdi-calendar"
                  readonly
                  hide-details
                  v-bind="attrs"
                  v-on="on"
                  id="calendar"
                  class="picker"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="targetDate"
                no-title
                scrollable
                @change="saveDate"
              />
            </v-menu>
          </v-col>
          <v-col cols="2">
            <v-btn small block @click="searchScoreData">조회</v-btn>
          </v-col>
        </v-row>
        <v-stepper v-model="s" class="elevation-0" id="stepper">
          <v-stepper-header class="elevation-0">
            <v-stepper-step
              :complete="s > 1"
              step="1"
              id="stepper-header-item"
              color="#00C089"
            >
              태도평가
            </v-stepper-step>
            <v-divider />
            <v-stepper-step
              :complete="s > 2"
              step="2"
              id="stepper-header-item"
              color="#00C089"
            >
              학습평가
            </v-stepper-step>
            <v-divider />
            <v-stepper-step step="3" id="stepper-header-item" color="#00C089">
              주관평가
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <attitude-score ref="attitude" />
            </v-stepper-content>
            <v-stepper-content step="2">
              <learning-score ref="learning" />
            </v-stepper-content>
            <v-stepper-content step="3">
              <score-comment ref="comment" />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <v-row id="button-component" align="end">
          <v-spacer />
          <v-col cols="2">
            <v-btn block small @click="closeDialog">취소</v-btn>
          </v-col>
          <v-col cols="2" v-if="s > 1" @click="clickPrevStep">
            <v-btn block small>
              <v-icon>mdi-menu-left</v-icon>
              이전 단계
            </v-btn>
          </v-col>
          <v-col cols="2" v-if="s < 3" @click="clickNextStep">
            <v-btn block small>
              다음 단계
              <v-icon>mdi-menu-right</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="2" v-if="s === 3">
            <v-btn block small @click="clickSaveButton">저장</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import AttitudeScore from "./daily/AttitudeScore";
import LearningScore from "./daily/LearningScore";
import ScoreComment from "./daily/ScoreComment";

export default {
  props: {
    showDailyInputDilog: Boolean,
  },
  watch: {
    showDailyInputDilog(newVal) {
      if (newVal) {
        this.s = 1;
        this.targetDate = new Date().toISOString().substr(0, 10);
        this.$refs.attitude.loadAttitudeData(this.targetDate);
      }
    },
  },
  components: { AttitudeScore, LearningScore, ScoreComment },
  data: () => ({
    dateMenu: false,
    targetDate: new Date().toISOString().substr(0, 10),
    s: 1,
    scores: [],
  }),
  methods: {
    searchScoreData() {
      if (this.s === 1) {
        this.$refs.attitude.loadAttitudeData(this.targetDate);
      } else if (this.s === 2) {
        this.$refs.learning.loadLearningData(this.targetDate);
      } else {
        this.$refs.comment.loadCommentData(this.targetDate);
      }
    },
    saveScoreData() {
      if (this.s === 1) {
        this.s = this.$refs.attitude.saveAttitudeData(this.targetDate);
      }
    },
    saveDate() {
      this.$refs.dateMenu.save(this.targetDate);
      this.dateMenu = false;
    },
    closeDialog() {
      this.$emit("update:showDailyInputDilog", false);
    },
    clickNextStep() {
      this.callSaveScoreRequest(true);
    },
    clickPrevStep() {
      this.callSaveScoreRequest(false);
    },
    clickSaveButton() {
      this.clickNextStep();
      this.$emit("update:showDailyInputDilog", false);
    },
    callSaveScoreRequest(isNext) {
      var req = {};
      if (this.s === 1) {
        req = this.$refs.attitude.getSaveAttitudeDataRequest(this.targetDate);
      } else if (this.s === 2) {
        req = this.$refs.learning.getSaveLearningDataRequest(this.targetDate);
      } else {
        req = this.$refs.comment.getSaveCommentDataRequest(this.targetDate);
      }
      axios
        .post("http://118.67.134.177:8080/student/score", req, {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then(() => {
          if (isNext) this.s++;
          else this.s--;
          this.searchScoreData();
        });
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
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
#stepper {
  margin-top: 20px;
}
#stepper-header-item {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
