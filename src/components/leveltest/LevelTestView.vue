<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0">
        <p id="title">레벨 테스트</p>
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
    <v-data-table
      :headers="headers"
      :items="levelTestInfo"
      :search="search"
      @dblclick:row="clickUpsertButton"
    >
      <template v-slot:[`item.name`]="{ item }">
        <div>
          {{ getName(item.name_ko, item.name_en) }}
        </div>
      </template>
    </v-data-table>
    <level-test-upsert :showDialog.sync="showDialog" :target="selectStudent" />
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import LevelTestUpsert from "./LevelTestUpsert";

export default {
  components: { LevelTestUpsert },
  created() {
    this.loadStudentLevelTestData();
  },
  watch: {
    showDialog(newVal) {
      if (!newVal) {
        this.loadStudentLevelTestData();
      }
    },
  },
  data: () => ({
    search: "",
    expanded: [],
    singleExpand: true,
    headers: [
      {
        text: "이름",
        sortable: false,
        align: "center",
        value: "name",
      },
      {
        text: "학년",
        sortable: false,
        align: "center",
        value: "grade",
      },
      {
        text: "테스트 레벨",
        sortable: false,
        align: "center",
        value: "testLevel",
      },
      {
        text: "테스트 점수",
        sortable: false,
        align: "center",
        value: "testScore",
      },
      {
        text: "최초 레벨",
        sortable: false,
        align: "center",
        value: "initLevel",
      },
    ],
    levelTestInfo: [],
    showDialog: false,
    selectStudent: "",
  }),
  methods: {
    loadStudentLevelTestData() {
      this.levelTestInfo.length = 0;
      axios
        .get("http://49.50.174.126:8080/student/test", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          response.data.forEach((student) => {
            this.levelTestInfo.push({
              id: student.studentId,
              name_ko: enc.decryptValue(student.nameKorean),
              name_en: student.nameEnglish,
              grade: student.grade,
              initLevel:
                (student.initLevelA !== null ? student.initLevelA : "") +
                (student.initLevelB !== null ? student.initLevelB : ""),
              initLevelA: student.initLevelA,
              initLevelB: student.initLevelB,
              testLevel: student.testLevel,
              testScore: student.testScore,
            });
          });
          this.levelTestInfo.sort(function (a, b) {
            return a.name_ko < b.name_ko ? -1 : a.name_ko > b.name_ko ? 1 : 0;
          });
          this.$store.state.levelTest = this.levelTestInfo;
          this.$forceUpdate();
        });
    },
    getName(name_ko, name_en) {
      return name_ko + "(" + name_en + ")";
    },
    clickUpsertButton(item, select) {
      this.showDialog = true;
      this.selectStudent = select.item.id;
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
#address {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
  margin-bottom: 0px;
}
#btn-testResult {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
</style>
