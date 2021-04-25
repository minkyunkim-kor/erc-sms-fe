<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">매출 현황</p>
      </v-col>
      <v-spacer />
      <v-col cols="2">
        <v-select
          id="add-input"
          :items="years"
          v-model="targetYear"
          prepend-icon="mdi-calendar"
          @change="getSummaryInfo"
        />
      </v-col>
    </v-row>
    <v-card id="chart-card">
      <v-card-text>
        <v-row id="info" align="center" justify="start">
          <v-col cols="3" class="py-0">
            <h6 id="datalabel-title">총 매출액</h6>
            <h3 id="datalabel-value">{{ currencyFormat(summaries.total) }}</h3>
          </v-col>
          <v-col cols="3" class="py-0">
            <h6 id="datalabel-title">카드</h6>
            <h3 id="datalabel-value">{{ currencyFormat(summaries.card) }}</h3>
          </v-col>
          <v-col cols="3" class="py-0">
            <h6 id="datalabel-title">현금</h6>
            <h3 id="datalabel-value">{{ currencyFormat(summaries.cash) }}</h3>
          </v-col>
        </v-row>
        <v-row align="start" justify="center">
          <v-col cols="6">
            <div id="area">
              <apexchart
                ref="areaChart"
                height="400px"
                :options="areaOptions"
                :series="areaSeries"
              />
            </div>
          </v-col>
          <v-col cols="6">
            <div id="stack">
              <apexchart
                ref="stackChart"
                height="400px"
                :options="stackedOptions"
                :series="stackedSeries"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  created() {
    this.getSummaryInfo();
  },
  data: () => ({
    targetYear: new Date().toISOString().substr(0, 4),
    month: Number(new Date().toISOString().substr(5, 7)),
    summaries: {
      total: 0,
      card: 0,
      cash: 0,
    },
    areaSeries: [
      {
        name: "총 매출",
        data: [],
      },
      {
        name: "수강료",
        data: [],
      },
      {
        name: "교재비",
        data: [],
      },
    ],
    areaOptions: {
      chart: { type: "area", zoom: { enabled: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: {
        categories: [],
        type: "datetime",
        labels: {
          datetimeFormatter: {
            month: "MM월",
          },
        },
      },
      tooltip: { x: { format: "yyyy-MM" } },
      fill: { type: "solid" },
    },
    stackedSeries: [
      {
        name: "카드 매출",
        data: [],
      },
      {
        name: "현금 매출",
        data: [],
      },
    ],
    stackedOptions: {
      chart: {
        type: "bar",
        stacked: true,
        toolbar: { show: true },
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      legend: {
        show: true,
        position: "bottom",
      },
      xaxis: {
        categories: [],
        type: "datetime",
        labels: {
          datetimeFormatter: {
            month: "MM월",
          },
        },
      },
      tooltip: { x: { format: "yyyy-MM" } },
      fill: { opacity: 1 },
    },
  }),
  computed: {
    years: {
      get() {
        var max = new Date().toISOString().substr(0, 4);
        var result = [];
        for (var year = 2018; year <= max; year++) {
          result.push(year.toString());
        }
        this.$forceUpdate();
        return result;
      },
    },
  },
  methods: {
    getSummaryInfo() {
      this.areaOptions.xaxis.categories.length = 0;
      this.stackedOptions.xaxis.categories.length = 0;
      this.summaries.total = 0;
      this.summaries.card = 0;
      this.summaries.cash = 0;
      this.areaSeries[0].data.length = 0;
      this.areaSeries[1].data.length = 0;
      this.areaSeries[2].data.length = 0;
      this.stackedSeries[0].data.length = 0;
      this.stackedSeries[1].data.length = 0;
      axios
        .get(
          "http://118.67.134.177:8080/bill/summary?targetYear=" +
            this.targetYear,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          response.data.summaries.forEach((item) => {
            this.areaOptions.xaxis.categories.push(
              this.targetYear + "-" + this.pad(item.month, 2)
            );
            this.stackedOptions.xaxis.categories.push(
              this.targetYear + "-" + this.pad(item.month, 2)
            );
            this.summaries.total += Number(item.deposit);
            this.summaries.card += Number(item.card);
            this.summaries.cash += Number(item.cash);
            this.areaSeries[0].data.push(item.deposit);
            this.areaSeries[1].data.push(item.tuition);
            this.areaSeries[2].data.push(item.bookPrice);
            this.stackedSeries[0].data.push(item.card);
            this.stackedSeries[1].data.push(item.cash);
          });
          this.$refs.areaChart.updateSeries(this.areaSeries);
          this.$refs.stackChart.updateSeries(this.stackedSeries);
        });
    },
    currencyFormat(num) {
      var regexp = /\B(?=(\d{3})+(?!\d))/g;
      return num.toString().replace(regexp, ",");
    },
    pad(str, max) {
      str = str.toString();
      return str.length < max ? this.pad("0" + str, max) : str;
    },
  },
};
</script>

<style scoped>
#add-input {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
#info {
  background-color: #1e88e5 !important;
  border-color: #1e88e5 !important;
}
#datalabel-title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  text-align: start;
  font-size: 13px !important;
  color: white;
  margin: 10px;
}
#datalabel-value {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  text-align: start;
  font-size: 20px !important;
  color: white;
  margin: 10px;
}
.v-input /deep/ .v-select__selections {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  justify-content: center;
}
.v-input /deep/ .v-select__selection--comma {
  margin-left: 10px;
}
.v-select-list /deep/ .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
</style>
