<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">월간 보고서</p>
      </v-col>
    </v-row>
    <v-row align="end" justify="center" class="mt-0 mb-3">
      <v-col cols="2">
        <v-select
          placeholder="이름"
          :items="names"
          v-model="target"
          hide-details
        />
      </v-col>
      <v-col cols="2">
        <v-menu
          ref="startDateMenu"
          v-model="startDateMenu"
          :close-on-content-click="false"
          :return-value.sync="startDate"
          transition="scale-transition"
          offset-y
          max-width="290px"
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
              placeholder="조회 시작 일자"
              hide-details
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDate"
            no-title
            scrollable
            :max="new Date().toISOString().substring(0, 10)"
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
          max-width="290px"
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
              placeholder="조회 종료 일자"
              hide-details
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDate"
            no-title
            scrollable
            :max="new Date().toISOString().substring(0, 10)"
            @change="saveEndDate"
          />
        </v-menu>
      </v-col>
      <v-col cols="3"><v-spacer /></v-col>
      <v-col cols="1">
        <v-btn id="search-btn" block small @click="searchReportData">
          조회
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn id="search-btn" block small @click="exportReport">
          PDF로 저장하기
        </v-btn>
      </v-col>
    </v-row>
    <report-detail-view class="pt-4" :details.sync="reportResult" />
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="2200"
      :filename="options.filename"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="1200px"
      :html-to-pdf-options="options"
      ref="target"
    >
      <section slot="pdf-content">
        <report-pdf-view :details.sync="reportResult" :comment.sync="comment" />
      </section>
    </vue-html2pdf>
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import ReportDetailView from "./ReportDetailView";
import ReportPdfView from "./ReportPdfView";
import VueHtml2pdf from "vue-html2pdf";

export default {
  components: {
    ReportDetailView,
    ReportPdfView,
    VueHtml2pdf,
  },
  created() {
    this.loadStudentNames();
  },
  data: () => ({
    students: [],
    names: [],
    target: "",
    startDateMenu: false,
    startDate: "",
    endDateMenu: false,
    endDate: "",
    comment: "",
    reportResult: {
      nameKorean: "",
      nameEnglish: "",
      grade: "",
      level: "",
    },
    options: {
      filename: "sample.pdf",
      margin: 1,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        width: 1200,
        height: 1696,
        scale: 4,
        dpi: 300,
        y: -20,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        compreePDF: true,
      },
    },
  }),
  methods: {
    loadStudentNames() {
      axios
        .get("http://49.50.174.126:8080/student/score/manual", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((res) => {
          this.students.length = 0;
          this.names.length = 0;
          res.data.forEach((student) => {
            this.students.push({
              studentId: student.studentId,
              name: enc.decryptValue(student.studentName),
              lastLevel: student.lastLevel,
            });
            this.names.push(enc.decryptValue(student.studentName));
          });
          this.names.sort(function (a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
          });
          this.students.sort(function (a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          });
        });
    },
    saveStartDate(date) {
      this.$refs.startDateMenu.save(date);
      this.startDateMenu = false;
    },
    saveEndDate(date) {
      this.$refs.endDateMenu.save(date);
      this.endDateMenu = false;
    },
    searchReportData() {
      this.comment = "";
      this.$store.state.comment = "";
      var index = this.names.findIndex((n) => n === this.target);
      axios
        .get(
          "http://49.50.174.126:8080/student/score/report?startDate=" +
            this.startDate +
            "&endDate=" +
            this.endDate,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
              "student-id": this.students[index].studentId,
            },
          }
        )
        .then((res) => {
          this.reportResult = {
            nameKorean: enc.decryptValue(res.data.nameKorean),
            nameEnglish: res.data.nameEnglish,
            grade: res.data.grade,
            level: res.data.level,
            school: res.data.school,
            registeredDate: res.data.registeredDate,
            averageA: res.data.averageA,
            averageH: res.data.averageH,
            averageP: res.data.averageP,
            averageM: res.data.averageM,
            averageD: res.data.averageD,
            averageOF: res.data.averageOF,
            averageC: res.data.averageC,
            averageG: res.data.averageG,
            averageW: res.data.averageW,
            averageS: res.data.averageS,
            startDate: this.startDate,
            endDate: this.endDate,
          };
          this.options.filename =
            "Report_" +
            this.reportResult.nameKorean +
            "_" +
            this.startDate +
            "_" +
            this.endDate +
            ".pdf";
        });
    },
    exportReport() {
      this.comment = this.$store.state.comment;
      this.$refs.target.generatePdf();
    },
  },
};
</script>

<style scoped>
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
.v-input /deep/ .v-select__selections {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.v-select-list /deep/ .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
#search-btn {
  padding-left: 3%;
  padding-right: 3%;
  background-color: #1d89e4;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: white;
}
</style>
