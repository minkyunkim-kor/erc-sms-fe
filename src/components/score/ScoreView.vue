<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">전체 평가 데이터</p>
      </v-col>
    </v-row>
    <v-row align="baseline" justify="start" class="mt-0">
      <v-col cols="3">
        <v-text-field
          id="search"
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="search"
        />
      </v-col>
      <v-col cols="5">
        <v-spacer />
      </v-col>
      <v-col cols="2">
        <v-menu
          ref="startDateMenu"
          v-model="startDateMenu"
          :close-on-content-click="false"
          :return-value.sync="startDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startDate"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              id="calendar"
              class="picker"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDate"
            no-title
            scrollable
            @change="saveStartDate"
          />
        </v-menu>
      </v-col>
      <v-col cols="2">
        <v-menu
          ref="endDateMenu"
          v-model="endDateMenu"
          :close-on-content-click="false"
          :return-value.sync="endDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endDate"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              id="calendar"
              class="picker"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDate"
            :min="startDate"
            :max="new Date().toISOString().substr(0, 10)"
            no-title
            scrollable
            @change="saveEndDate"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="scoreInfo"
      :search="search"
      disable-sort
    />
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";

export default {
  created() {
    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 3);
    this.startDate = this.startDate.toISOString().substring(0, 10);
    this.endDate = new Date();
    this.endDate = this.endDate.toISOString().substring(0, 10);
    this.loadScoreData();
  },
  watch: {
    startDate: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadScoreData();
      }
    },
    endDate: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadScoreData();
      }
    },
  },
  data: () => ({
    search: "",
    scoreInfo: [],
    startDateMenu: false,
    startDate: "",
    endDateMenu: false,
    endDate: "",
    headers: [
      { text: "이름", align: "center", value: "name" },
      { text: "수업일", align: "center", value: "lessonDate" },
      { text: "수업 레벨", align: "center", value: "lessonLevel" },
      { text: "A", align: "center", value: "scoreA", filterable: false },
      { text: "H", align: "center", value: "scoreH", filterable: false },
      { text: "P", align: "center", value: "scoreP", filterable: false },
      { text: "M", align: "center", value: "scoreM", filterable: false },
      { text: "D", align: "center", value: "scoreD", filterable: false },
      { text: "OF", align: "center", value: "scoreOF", filterable: false },
      { text: "C", align: "center", value: "scoreC", filterable: false },
      { text: "G", align: "center", value: "scoreG", filterable: false },
      { text: "W", align: "center", value: "scoreW", filterable: false },
      { text: "S", align: "center", value: "scoreS", filterable: false },
      { text: "담당 선생님", align: "center", value: "teacher" },
    ],
  }),
  methods: {
    saveStartDate(date) {
      this.$refs.startDateMenu.save(date);
      this.startDateMenu = false;
    },
    saveEndDate(date) {
      this.$refs.endDateMenu.save(date);
      this.endDateMenu = false;
    },
    loadScoreData() {
      axios
        .get(
          "http://118.67.134.177:8080/student/score?startDate=" +
            this.startDate +
            "&endDate=" +
            this.endDate,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          this.scoreInfo.length = 0;
          response.data.forEach((score) => {
            this.scoreInfo.push({
              studentId: score.studentId,
              studentScoreId: score.studentScoreId,
              name: enc.decryptValue(score.name),
              lessonDate: score.lessonDate,
              lessonLevel: score.lessonLevel,
              scoreA: score.scoreA,
              scoreH: score.scoreH,
              scoreP: score.scoreP,
              scoreM: score.scoreM,
              scoreD: score.scoreD,
              scoreOF: score.scoreOF,
              scoreC: score.scoreC,
              scoreG: score.scoreG,
              scoreW: score.scoreW,
              scoreS: score.scoreS,
              teacher: score.teacher,
            });
          });
          this.$store.state.scoreInfo = this.scoreInfo;
        });
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
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
</style>
