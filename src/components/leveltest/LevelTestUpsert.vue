<template>
  <v-dialog v-model="showDialog" persistent max-width="400px">
    <v-card>
      <v-card-title>레벨 테스트 정보 입력</v-card-title>
      <v-card-text>
        <v-row id="button-component" align="baseline">
          <v-spacer />
          <v-col cols="2">
            <v-btn block small @click="closeDialog">취소</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: Boolean,
  },
  methods: {
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
  },
};
</script>

<style scoped>
.v-card .v-card__title {
  background-color: #00c089 !important;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 16px !important;
  color: white !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
#button-component {
  margin-top: 25px;
}
</style>
