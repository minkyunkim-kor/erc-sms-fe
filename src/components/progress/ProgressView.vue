<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0">
        <p id="title">학습 진도표</p>
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
      :items="details"
      :search="search"
      :loading="loading"
      loading-text="학습 진도 정보를 불러오는 중입니다."
      @dblclick:row="clickUpsertButton"
    >
      <template v-slot:[`item.name`]="{ item }">
        <div>
          {{ getName(item.name, item.nameEn) }}
        </div>
      </template>
      <template v-slot:[`item.progress`]="{ item }">
        <v-progress-linear :value="item.percentage" color="#ee534f" height="15">
          <strong> {{ item.percentage }}% </strong>
        </v-progress-linear>
      </template>
    </v-data-table>
    <progress-upsert :showDialog.sync="showDialog" :target="selectStudent" />
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import ProgressUpsert from "./ProgressUpsert";

export default {
  components: { ProgressUpsert },
  created() {
    this.loadProgressData();
  },
  watch: {
    showDialog(newVal) {
      if (!newVal) {
        this.loadProgressData();
      }
    },
  },
  data: () => ({
    search: "",
    loading: false,
    headers: [
      { text: "구분", align: "center", value: "category", width: "15%" },
      { text: "이름", align: "center", value: "name", width: "15%" },
      {
        text: "현재 레벨",
        align: "center",
        value: "current",
        width: "15%",
        sortable: false,
      },
      {
        text: "졸업 달성률",
        align: "center",
        value: "progress",
        width: "55%",
        sortable: false,
      },
    ],
    details: [],
    showDialog: false,
    selectStudent: "",
  }),
  methods: {
    loadProgressData() {
      this.loading = true;
      this.details.length = 0;
      axios
        .get("http://49.50.174.126:8080/student/progress", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          response.data.forEach((progress) => {
            this.details.push({
              studentId: progress.studentId,
              category: progress.category,
              name: enc.decryptValue(progress.name),
              nameEn: progress.nameEn,
              current: progress.currentLevel,
              percentage: this.getProgress(
                progress.currentLevel,
                progress.progresses
              ),
            });
          });
          this.details.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          });
          this.loading = false;
        });
    },
    getName(name, name_en) {
      return name + "(" + name_en + ")";
    },
    getProgress(current, progress) {
      if (progress.length === 0) return 0;
      var level_score = new Map();
      level_score.set("A", 0);
      level_score.set("B", 16);
      level_score.set("C", 32);
      level_score.set("PR", 48);
      level_score.set("D", 60);
      level_score.set("E", 76);
      level_score.set("F", 92);
      level_score.set("G", 108);
      level_score.set("H", 120);
      level_score.set("I", 136);
      level_score.set("J", 144);
      level_score.set("K", 152);
      var result = 0;
      if (current.length === 5) {
        result =
          level_score.get(current.slice(0, 2)) +
          (2 * (Number(current.slice(2, 3)) - 1) + Number(current.slice(4, 5)));
      } else if (current.length === 4) {
        result =
          level_score.get(current.slice(0, 1)) +
          (2 * (Number(current.slice(1, 2)) - 1) + Number(current.slice(3, 4)));
      } else {
        result =
          level_score.get(current.slice(0, 1)) + Number(current.slice(1, 2));
      }
      return ((result / 160.0) * 100).toFixed(1);
    },
    clickUpsertButton(item, select) {
      this.showDialog = true;
      this.selectStudent = select.item.studentId;
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
</style>
