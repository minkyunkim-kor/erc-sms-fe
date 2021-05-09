<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0">
        <p id="title">클래스 정보</p>
      </v-col>
    </v-row>
    <v-row align="baseline" justify="space-between" class="mt-0">
      <v-col cols="3">
        <v-text-field
          id="lesson-search"
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="search"
        />
      </v-col>
      <v-col cols="2">
        <v-btn id="add-lesson" small block @click="clickAddLesson">
          <v-icon x-small class="mr-1">mdi-plus</v-icon>
          신규 클래스 등록
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="lessonInfo"
      :search="search"
      disable-sort
      @dblclick:row="dblClickLesson"
    />
    <lesson-input :showInputDialog.sync="showInputDialog" />
    <lesson-edit
      :showEditDialog.sync="showEditDialog"
      :selectLessonId="selectLesson"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import LessonInput from "./LessonInput";
import LessonEdit from "./LessonEdit";

export default {
  components: { LessonInput, LessonEdit },
  created() {
    this.loadLessonData();
  },
  watch: {
    showInputDialog: function (newVal) {
      if (!newVal) {
        this.loadLessonData();
      }
    },
    showEditDialog: function (newVal) {
      if (!newVal) {
        this.loadLessonData();
      }
    },
  },
  data: () => ({
    showInputDialog: false,
    showEditDialog: false,
    headers: [
      { text: "클래스", align: "center", value: "name" },
      { text: "수업시간", align: "center", value: "time" },
      {
        text: "인원",
        align: "center",
        value: "studentCount",
        filterable: false,
      },
      { text: "담당 선생님", align: "center", value: "teacher" },
      {
        text: "학생",
        align: "center",
        value: "student",
        filterable: false,
      },
    ],
    lessonInfo: [],
    search: "",
    selectLesson: "",
  }),
  methods: {
    loadLessonData() {
      this.lessonInfo.length = 0;
      axios
        .get("http://49.50.174.126:8080/lesson", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          response.data.forEach((info) => {
            var times = "";
            info.times.forEach((time) => {
              times += time.weekday + "(" + time.start + "), ";
            });
            var lessonDetail = {
              lessonId: info.lessonId,
              name: info.name,
              teacher: enc.decryptValue(info.teacher),
              student: this.decryptStudnetName(info.student),
              studentCount: info.studentCount,
              timeInfo: info.times,
              time: times.substring(0, times.length - 2),
            };
            this.lessonInfo.push(lessonDetail);
          });
          this.$store.state.lessonInfo = this.lessonInfo;
          this.$forceUpdate();
        });
    },
    decryptStudnetName(val) {
      var students = val.split(", ");
      var decryptedName = [];
      students.forEach((s) => decryptedName.push(enc.decryptValue(s)));
      return decryptedName.join(", ");
    },
    clickAddLesson() {
      this.showInputDialog = true;
    },
    dblClickLesson(item, select) {
      this.selectLesson = select.item.lessonId;
      this.showEditDialog = true;
    },
  },
};
</script>

<style scoped>
.v-input /deep/ #lesson-search {
  margin-left: 5%;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
#add-lesson {
  padding-left: 3%;
  padding-right: 3%;
  background-color: #00c089;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: white;
}
</style>
