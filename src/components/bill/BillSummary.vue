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
          <v-col cols="8">
            <div id="line">
              <apexchart
                ref="lineChart"
                height="300px"
                :options="lineOptions"
                :series="lineSeries"
              />
            </div>
          </v-col>
          <v-col cols="4">
            <div id="stack">
              <apexchart
                ref="stackChart"
                height="300px"
                :options="stackedOptions"
                :series="stackedSeries"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row>
      <br />
      <br />
    </v-row>
    <v-card>
      <v-card-text>
        <v-row>
          <table id="summary-table">
            <thead id="summary-content">
              <tr>
                <th colspan="2">항목</th>
                <th v-for="(name, i) in headers" :key="i">
                  {{ name }}
                </th>
              </tr>
            </thead>
            <tbody id="summary-content">
              <tr>
                <td rowspan="3" width="34px" style="background-color: #f2f2f2">
                  매출
                </td>
                <td width="50px" style="background-color: #f2f2f2">수강료</td>
                <td v-for="(detail, i) in details" :key="i" width="74px">
                  {{ currencyFormat(detail.tuition) }}
                </td>
              </tr>
              <tr>
                <td style="background-color: #f2f2f2">교재비</td>
                <td v-for="(detail, i) in details" :key="i">
                  {{ currencyFormat(detail.bookPrice) }}
                </td>
              </tr>
              <tr>
                <td style="background-color: #f2f2f2">합계</td>
                <td v-for="(detail, i) in details" :key="i">
                  {{ currencyFormat(detail.sum) }}
                </td>
              </tr>
              <tr>
                <td rowspan="3" style="background-color: #f2f2f2">수납</td>
                <td style="background-color: #f2f2f2">카드</td>
                <td v-for="(detail, i) in details" :key="i">
                  {{ currencyFormat(detail.card) }}
                </td>
              </tr>
              <tr>
                <td style="background-color: #f2f2f2">현금</td>
                <td v-for="(detail, i) in details" :key="i">
                  {{ currencyFormat(detail.cash) }}
                </td>
              </tr>
              <tr>
                <td style="background-color: #f2f2f2">합계</td>
                <td v-for="(detail, i) in details" :key="i">
                  {{
                    currencyFormat(Number(detail.cash) + Number(detail.card))
                  }}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="background-color: #f2f2f2">미납금</td>
                <td v-for="(detail, i) in details" :key="i">
                  {{ currencyFormat(detail.unpaid) }}
                </td>
              </tr>
            </tbody>
          </table>
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
    lineSeries: [
      { name: "수납금", data: [] },
      { name: "미납금", data: [] },
    ],
    lineOptions: {
      chart: { type: "line", zoom: { enabled: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      colors: ["#1D89E4", "#EE534F"],
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
    headers: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    details: [],
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
      this.lineOptions.xaxis.categories.length = 0;
      this.stackedOptions.xaxis.categories.length = 0;
      this.summaries.total = 0;
      this.summaries.card = 0;
      this.summaries.cash = 0;
      this.lineSeries[0].data.length = 0;
      this.lineSeries[1].data.length = 0;
      this.stackedSeries[0].data.length = 0;
      this.stackedSeries[1].data.length = 0;
      this.details.length = 0;
      axios
        .get(
          "http://49.50.174.126:8080/bill/summary?targetYear=" +
            this.targetYear,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          response.data.forEach((item) => {
            this.lineOptions.xaxis.categories.push(
              this.targetYear + "-" + this.pad(item.month, 2)
            );
            this.stackedOptions.xaxis.categories.push(
              this.targetYear + "-" + this.pad(item.month, 2)
            );
            this.summaries.total +=
              Number(item.tuition) + Number(item.bookPrice);
            this.summaries.card += Number(item.card);
            this.summaries.cash += Number(item.cash);
            this.lineSeries[0].data.push(item.deposit);
            var unpaid =
              Number(item.tuition) +
              Number(item.bookPrice) -
              Number(item.deposit);
            this.lineSeries[1].data.push(unpaid);
            this.stackedSeries[0].data.push(item.card);
            this.stackedSeries[1].data.push(item.cash);
            this.details.push({
              tuition: item.tuition,
              bookPrice: item.bookPrice,
              sum: Number(item.tuition) + Number(item.bookPrice),
              card: item.card,
              cash: item.cash,
              unpaid: unpaid,
            });
          });
          this.$refs.lineChart.updateSeries(this.lineSeries);
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
#summary-table {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
  border-collapse: collapse;
  width: 100%;
}
#summary-content {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 10px;
  text-align: center;
}
#summary-content th {
  background-color: #d9d9d9;
  border: 1px solid gainsboro;
  border-collapse: collapse;
}
#summary-content td {
  border: 1px solid gainsboro;
  border-collapse: collapse;
}
</style>
