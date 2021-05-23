<template>
  <v-dialog v-model="showDialog" persistent max-width="550px">
    <v-card>
      <v-card-title id="card-edit-title">지점 정보 수정</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="account.name"
              placeholder="지점명"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-identifier"
              v-model="account.id"
              placeholder="지점 ID"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="baseline">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-lock"
              v-model="account.pw"
              placeholder="패스워드"
              type="password"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-radio-group v-model="account.suspendYn" row hide-details>
              <v-radio label="정상 사용" value="N" />
              <v-radio label="사용 중지" value="Y" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row id="button-component" align="baseline">
          <v-spacer />
          <v-col cols="2">
            <v-btn id="btn-cancel" block small @click="closeDialog">
              취소
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn id="btn-remove" block small @click="removeUser">
              삭제
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn id="btn-save" block small @click="clickSaveButton">
              저장
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <error-popup :showDialog.sync="isError" :errorMessage="errorMessage" />
    <remove-alert
      :showDialog.sync="removeDialog"
      :confirmRemove.sync="confirmRemove"
      component="user"
      :target="target"
    />
  </v-dialog>
</template>

<script>
import axios from "axios";
import RemoveAlert from "../popup/RemoveAlert";
import ErrorPopup from "../popup/ErrorPopup";

export default {
  props: {
    showDialog: Boolean,
    target: String,
  },
  components: { RemoveAlert, ErrorPopup },
  watch: {
    showDialog(newVal) {
      if (newVal) {
        this.loadAccount();
      }
    },
    confirmRemove: function (newVal) {
      if (newVal) {
        this.closeDialog();
      }
    },
  },
  data: () => ({
    account: {},
    removeDialog: false,
    confirmRemove: false,
    isError: false,
    errorMessage: "",
  }),
  methods: {
    loadAccount() {
      axios
        .get("http://49.50.174.126:8080/user/" + this.target, {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          this.account = {
            id: response.data.id,
            pw: "",
            name: response.data.name,
            suspendYn: response.data.suspendYn,
          };
        });
    },
    removeUser() {
      this.removeDialog = true;
    },
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
            name: this.account.name,
            suspendYn: this.account.suspendYn,
            isNew: false,
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
      if (this.account.id === "" || this.account.id.trim() === "") {
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
</style>
