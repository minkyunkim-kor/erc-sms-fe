<template>
  <v-dialog v-model="showDialog" persistent max-width="300px">
    <v-card>
      <v-card-title>
        <v-icon id="warning">mdi-emoticon-sad</v-icon>
        <p id="title">{{ errorMessage }}</p>
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn id="ok" text @click="clickOk">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  methods: {
    clickOk() {
      this.$emit("update:showDialog", false);
    },
  },
};
</script>

<style scoped>
.v-card .v-card__title {
  background-color: #ee534f !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
  padding-top: 10px !important;
  padding-bottom: 4px !important;
}
#title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 14px !important;
  color: white !important;
  margin-bottom: 0px;
}
#warning {
  color: white !important;
  margin-left: 0px;
  margin-right: 10px;
}
#ok {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: bolder;
}
</style>
