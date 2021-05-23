<template>
  <v-dialog v-model="showDialog" persistent max-width="500px">
    <v-card>
      <v-card-title id="card-input-title">신규 지점 등록</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="4">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="account.name"
              placeholder="지점명"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-identifier"
              v-model="account.id"
              placeholder="지점 ID"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-lock"
              v-model="account.pw"
              placeholder="패스워드"
              type="password"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row id="button-component" align="baseline">
          <v-spacer />
          <v-col cols="3">
            <v-btn id="btn-cancel" block small @click="closeDialog">
              취소
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn id="btn-save" block small @click="clickSaveButton">
              저장
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: { showDialog: Boolean },
  created() {},
  data: () => ({
    account: {},
  }),
  methods: {
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    clickSaveButton() {
      axios
        .post(
          "http://49.50.174.126:8080/user",
          {
            id: this.account.id,
            pw: this.account.pw,
            name: this.account.name,
            suspendYn: "N",
            isNew: true,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then(() => this.$emit("update:showDialog", false));
    },
  },
};
</script>

<style scoped>
#add-component {
  margin-top: 25px;
}
#button-component {
  margin-top: 25px;
}
.v-input /deep/ #add-input {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
</style>
