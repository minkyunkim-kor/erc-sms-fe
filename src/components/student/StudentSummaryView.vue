<template>
  <v-container fluid style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0">
        <p id="title">학생 현황</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-card id="chart-card" height="70px">
          <v-card-text class="d-flex align-center ma-0 pt-1 pb-1 pl-4">
            <span id="lstick" />
            <v-icon x-large>mdi-account-circle</v-icon>
            <div class="ml-7">
              <h5 id="chart-title">총 학생수</h5>
              <h2 id="total-count-number">{{ currencyFormat(total) }}</h2>
            </div>
          </v-card-text>
        </v-card>
        <v-card id="chart-card" height="430px">
          <v-card-title>
            <h3 id="chart-title">
              <span id="lstick" />
              재원별 학생현황
            </h3>
          </v-card-title>
          <v-card-text>
            <v-row justify="center">
              <apexchart
                type="donut"
                width="250px"
                :series="donut_series"
                :options="donut_chart_options"
              />
            </v-row>
            <div class="d-flex align-center border-bottom py-1 mt-4">
              <span id="chart-datalabel">신입생</span>
              <div class="ml-auto">
                <span id="chart-datalabel">
                  {{ this.category.newly }}
                </span>
              </div>
            </div>
            <div class="d-flex align-center border-bottom py-1">
              <span id="chart-datalabel">재원생</span>
              <div class="ml-auto">
                <span id="chart-datalabel">
                  {{ this.category.register }}
                </span>
              </div>
            </div>
            <div class="d-flex align-center border-bottom py-1">
              <span id="chart-datalabel">휴원생</span>
              <div class="ml-auto">
                <span id="chart-datalabel">
                  {{ this.category.rest }}
                </span>
              </div>
            </div>
            <div class="d-flex align-center border-bottom py-1">
              <span id="chart-datalabel">퇴원생</span>
              <div class="ml-auto">
                <span id="chart-datalabel">
                  {{ this.category.withdrawal }}
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card id="chart-card" height="510px">
          <v-card-title>
            <h3 id="chart-title">
              <span id="lstick" />
              월별 등록 현황
            </h3>
          </v-card-title>
          <v-card-text>
            <v-row justify="space-around">
              <apexchart
                ref="monthly"
                type="bar"
                width="560"
                height="400"
                :options="bar_chart_options"
                :series="bar_series"
              />
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  created() {
    this.loadSummaryData();
  },
  data: () => ({
    total: 0,
    category: {
      newly: 0,
      register: 0,
      rest: 0,
      withdrawal: 0,
    },
    register: [],
    donut_series: [],
    donut_chart_options: {
      chart: {
        type: "donut",
      },
      labels: ["신입생", "재원생", "휴원생", "퇴원생"],
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
    },
    bar_series: [
      {
        name: "학생수",
        data: [],
      },
    ],
    bar_chart_options: {
      xaxis: {
        labels: {
          rotate: -45,
          offsetX: 5,
        },
        categories: [],
      },
      yaxis: {
        forceNiceScale: true,
        labels: {
          formatter: function (val) {
            return Number(val.toFixed(1));
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
  }),
  methods: {
    loadSummaryData() {
      axios
        .get("http://49.50.174.126:8080/student/summary", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          this.total = response.data.total;
          this.category = response.data.category;
          this.donut_series = [
            response.data.category.newly,
            response.data.category.register,
            response.data.category.rest,
            response.data.category.withdrawal,
          ];
          this.register = response.data.register;
          this.bar_chart_options.xaxis.categories.length = 0;
          for (const key of Object.keys(this.register).sort()) {
            this.bar_chart_options.xaxis.categories.push(key);
            this.bar_series[0].data.push(this.register[key]);
          }
          this.$refs.monthly.updateSeries(this.bar_series);
        });
    },
    currencyFormat(num) {
      var regexp = /\B(?=(\d{3})+(?!\d))/g;
      return num.toString().replace(regexp, ",");
    },
  },
};
</script>

<style scoped>
.v-application .subtitle-1 {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  text-align: start;
  font-size: 13px !important;
  color: black;
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
#chart-card {
  margin: 8px;
  padding: 5px;
  text-align: center;
}
#lstick {
  width: 2px;
  background: #398bf7;
  height: 30px;
  margin-left: -20px;
  margin-right: 18px;
  position: absolute;
}
#total-count-number {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  text-align: start;
  color: black;
  margin-left: 5px;
}
#chart-title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  text-align: start;
  font-size: 13px !important;
  padding-top: 5px;
}
#chart-datalabel {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  text-align: start;
  font-size: 13px !important;
}
.apexcharts-canvas {
  justify-content: center;
}
</style>
