<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">미납금 현황</p>
      </v-col>
    </v-row>
    <v-row align="baseline" justify="space-between">
      <v-col cols="2">
        <v-select
          id="add-input"
          :items="years"
          v-model="targetYear"
          prepend-icon="mdi-calendar"
          hide-details
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  created() {},
  data: () => ({
    targetYear: new Date().toISOString().substr(0, 4),
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
    saveYear(val) {
      this.targetYear = String(val);
      this.$refs.yearMenu.save(this.targetYear);
      this.yearMenu = false;
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
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
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
