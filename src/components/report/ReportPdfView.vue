<template>
  <div style="width: 1180px">
    <v-row id="header-and-footer" align="center">
      <v-col cols="90p">
        <p id="report-title">Monthly Report</p>
      </v-col>
      <v-col cols="10p">
        <img src="../../assets/logo_2.png" width="80px" />
      </v-col>
    </v-row>
    <v-row>
      <br />
      <br />
    </v-row>
    <v-row>
      <v-col cols="1" />
      <v-col cols="10">
        <h2 id="report-label">
          <v-icon color="#0058A2">mdi-account</v-icon>
          Student Information
        </h2>
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row>
      <v-col cols="1" />
      <v-col cols="10" id="border-row">
        <v-row
          justify="space-around"
          style="padding-top: 10px; padding-bottom: 10px"
        >
          <v-col cols="3">
            <h6 id="info-title">Name</h6>
            <h4 id="info-value" v-if="details.nameKorean !== ''">
              {{ getName() }}
            </h4>
          </v-col>
          <v-col cols="2">
            <h6 id="info-title">School</h6>
            <h4 id="info-value">{{ details.school }}</h4>
          </v-col>
          <v-col cols="1">
            <h6 id="info-title">Grade</h6>
            <h4 id="info-value">{{ details.grade }}</h4>
          </v-col>
          <v-col cols="2">
            <h6 id="info-title">Level</h6>
            <h4 id="info-value">{{ details.level }}</h4>
          </v-col>
          <v-col cols="4">
            <h6 id="info-title">Date</h6>
            <h4 id="info-value" v-if="details.nameKorean !== ''">
              {{ details.startDate }} ~ {{ details.endDate }}
            </h4>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row>
      <br />
      <br />
    </v-row>
    <v-row>
      <v-col cols="1" />
      <v-col cols="10">
        <h2 id="report-label">
          <v-icon color="#0058A2">mdi-home-variant-outline</v-icon>
          Class Performance
        </h2>
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row>
      <v-col cols="1" />
      <v-col cols="10" style="padding: 0px">
        <table id="chart-table">
          <tr align="center">
            <td id="chart-table-header" width="25%">항목</td>
            <td id="chart-table-header" width="75%">성취도</td>
          </tr>
          <tr align="center">
            <td id="chart-table-category">Attendance (출석)</td>
            <td rowspan="4" id="chart-table-chart">
              <apexchart
                ref="attitudeChart"
                height="250"
                type="bar"
                :options="attitudeChartOptions"
                :series="attitudeInfo"
              />
            </td>
          </tr>
          <tr align="center">
            <td id="chart-table-category">Homework (숙제)</td>
            <td rowspan="4"></td>
          </tr>
          <tr align="center">
            <td id="chart-table-category">Participation (참여도)</td>
            <td rowspan="4"></td>
          </tr>
          <tr align="center">
            <td id="chart-table-category">Manner (예의)</td>
            <td rowspan="4"></td>
          </tr>
        </table>
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row>
      <br />
      <br />
    </v-row>
    <v-row>
      <v-col cols="1" />
      <v-col cols="10">
        <h2 id="report-label">
          <v-icon color="#0058A2">mdi-star</v-icon>
          Achievement
        </h2>
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row>
      <v-col cols="1" />
      <v-col cols="10" id="border-row">
        <div style="width: 100%">
          <apexchart
            ref="learningChart"
            width="100%"
            height="300"
            type="bar"
            :options="learningChartOptions"
            :series="learningInfo"
          />
        </div>
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row>
      <br />
      <br />
    </v-row>
    <v-row>
      <v-col cols="1" />
      <v-col cols="10">
        <h2 id="report-label">
          <v-icon color="#0058A2">mdi-comment-text</v-icon>
          Teacher's Comment
        </h2>
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row>
      <v-col cols="1" />
      <v-col cols="10" id="border-row">
        <div id="comment" v-html="comment" />
      </v-col>
      <v-col cols="1" />
    </v-row>
    <v-row>
      <br />
      <br />
    </v-row>
    <v-row id="header-and-footer" style="margin-top: 50px">
      <br />
      <br />
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    details: Object,
    comment: String,
  },
  data: () => ({
    attitudeChartOptions: {
      xaxis: { categories: ["A", "H", "P", "M"] },
      yaxis: { min: 0, max: 6, forceNiceScale: true },
      plotOptions: { bar: { distributed: true, horizontal: true } },
      colors: ["#64C026", "#4C72D0", "#13A79D", "#A577D7"],
      legend: { show: false },
    },
    attitudeInfo: [{ name: "태도 평가", data: [0, 0, 0, 0] }],
    learningChartOptions: {
      xaxis: {
        categories: [
          ["Decoding/Phonics", "Sight Words"],
          "Oral Reading Fluency",
          "Comprehension",
          "Grammar",
          "Writing",
          "Speaking",
        ],
        labels: {
          rotate: 0,
          hideOverlappingLabels: false,
          style: {
            fontSize: "15px",
            fontFamily: "NanumSquareRound, sans-serif",
            fontWeight: 500,
          },
        },
      },
      yaxis: {
        min: 0,
        max: 6,
        forceNiceScale: true,
        labels: {
          formatter(val) {
            return val.toFixed(1);
          },
        },
      },
      plotOptions: { bar: { distributed: true } },
      colors: [
        "#F7C308",
        "#F96FAD",
        "#F17816",
        "#933144",
        "#C88854",
        "#FC5A52",
      ],
      legend: { show: false },
    },
    learningInfo: [{ name: "학습평가", data: [0, 0, 0, 0, 0, 0] }],
  }),
  methods: {
    getName() {
      return this.details.nameKorean + "(" + this.details.nameEnglish + ")";
    },
    updateAttitudeChart() {
      this.attitudeInfo[0].data.length = 0;
      this.attitudeInfo[0].data = [
        this.details.averageA !== undefined
          ? Number(this.details.averageA).toFixed(1)
          : 0,
        this.details.averageH !== undefined
          ? Number(this.details.averageH).toFixed(1)
          : 0,
        this.details.averageP !== undefined
          ? Number(this.details.averageP).toFixed(1)
          : 0,
        this.details.averageM !== undefined
          ? Number(this.details.averageM).toFixed(1)
          : 0,
      ];
      this.$refs.attitudeChart.updateSeries(this.attitudeInfo);
    },
    updateLearningChart() {
      this.learningInfo[0].data.length = 0;
      this.learningInfo[0].data = [
        this.details.averageD !== undefined
          ? Number(this.details.averageD).toFixed(1)
          : 0,
        this.details.averageOF !== undefined
          ? Number(this.details.averageOF).toFixed(1)
          : 0,
        this.details.averageC !== undefined
          ? Number(this.details.averageC).toFixed(1)
          : 0,
        this.details.averageG !== undefined
          ? Number(this.details.averageG).toFixed(1)
          : 0,
        this.details.averageW !== undefined
          ? Number(this.details.averageW).toFixed(1)
          : 0,
        this.details.averageS !== undefined
          ? Number(this.details.averageS).toFixed(1)
          : 0,
      ];
      this.$refs.learningChart.updateSeries(this.learningInfo);
    },
  },
  watch: {
    details(newVal, oldVal) {
      if (newVal != oldVal) {
        this.updateAttitudeChart();
        this.updateLearningChart();
      }
    },
  },
};
</script>

<style scoped>
#header-and-footer {
  background-color: #1d89e4;
}
#report-title {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 45px;
  font-weight: 800;
  margin-bottom: 0px;
  margin-left: 10px;
  color: white;
  padding-top: 20px;
  padding-bottom: 20px;
}
#report-label {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 30px;
  text-align: start;
  margin-bottom: 0px;
  color: #0055a0;
  margin-top: 15px;
}
#border-row {
  border: 1px solid #bfbfbf !important;
}
#info-title {
  font-family: "NanumSquareRound", sans-serif;
  color: grey;
  font-size: 15px;
  font-weight: 500;
}
#info-value {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 20px;
  font-weight: 500;
}
#chart-table {
  border-collapse: collapse;
  margin-right: 0px;
}
#chart-table-header {
  border: 1px solid #bfbfbf !important;
  border-collapse: collapse;
  background-color: #d9d9d9;
  font-family: "NanumSquareRound", sans-serif;
  font-size: 20px;
  font-weight: 500;
  padding-top: 10px;
  padding-bottom: 10px;
}
#chart-table-category {
  border: 1px solid #bfbfbf !important;
  border-collapse: collapse;
  background-color: #f2f2f2;
  width: 25%;
  font-family: "NanumSquareRound", sans-serif;
  font-size: 20px;
  font-weight: 500;
  padding-top: 10px;
  padding-bottom: 10px;
}
#chart-table-chart {
  border: 1px solid #bfbfbf !important;
  border-collapse: collapse;
}
#comment {
  font-family: "NanumSquareRound", sans-serif;
  font-size: 20px;
  font-weight: 500;
}
.col-10p {
  flex: 0 0 10%;
  max-width: 10%;
}
.col-90p {
  flex: 0 0 90%;
  max-width: 90%;
}
</style>
