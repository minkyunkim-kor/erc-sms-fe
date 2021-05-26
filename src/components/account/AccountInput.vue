<template>
  <v-dialog v-model="showDialog" persistent max-width="500px">
    <v-card>
      <v-card-title id="card-input-title">신규 계정 등록</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="account.teacher"
              placeholder="이름"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-home-variant-outline"
              v-model="account.name"
              placeholder="지점명"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="baseline">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-identifier"
              v-model="account.id"
              placeholder="ID"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-lock"
              v-model="account.pw"
              placeholder="패스워드"
              :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPw ? 'text' : 'password'"
              @click:append="showPw = !showPw"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="7">
            <v-spacer />
          </v-col>
          <v-col cols="5">
            <v-radio-group v-model="account.suspendYn" row hide-details>
              <v-radio label="사용" value="N" />
              <v-radio label="중지" value="Y" />
            </v-radio-group>
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
    <error-popup :showDialog.sync="isError" :errorMessage="errorMessage" />
  </v-dialog>
</template>

<script>
import axios from "axios";
import ErrorPopup from "../popup/ErrorPopup";

export default {
  props: { showDialog: Boolean },
  components: { ErrorPopup },
  created() {
    this.account = {
      id: "",
      pw: "",
      teacher: "",
      name: "",
      suspendYn: "N",
    };
  },
  data: () => ({
    account: {},
    isError: false,
    errorMessage: "",
    showPw: false,
  }),
  methods: {
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    clickSaveButton() {
      if (!this.checkValidate()) {
        return;
      }
      axios
        .post(
          "http://49.50.174.126:8080/user",
          {
            id: this.account.id,
            pw: this.account.pw,
            teacher: this.account.teacher,
            name: this.account.name,
            suspendYn: this.account.suspendYn,
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
    checkValidate() {
      var valid = true;
      if (this.account.teacher === "" || this.account.teacher.trim() === "") {
        this.isError = true;
        this.errorMessage = "이름을 입력하세요";
        valid = false;
      } else if (this.account.id === "" || this.account.id.trim() === "") {
        this.isError = true;
        this.errorMessage = "ID를 입력하세요";
        valid = false;
      } else if (this.account.name === "" || this.account.name.trim() === "") {
        this.isError = true;
        this.errorMessage = "지점명을 입력하세요";
        valid = false;
      } else if (this.account.pw === "" || this.account.pw.trim() === "") {
        this.isError = true;
        this.errorMessage = "패스워드를 입력하세요";
        valid = false;
      } else if (
        this.account.suspendYn === "" ||
        this.account.suspendYn.trim() === ""
      ) {
        this.isError = true;
        this.errorMessage = "상태를 입력하세요";
        valid = false;
      }
      return valid;
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
.v-input--selection-controls /deep/ .v-label {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: end;
}
</style>
