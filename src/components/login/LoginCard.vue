<template>
  <div id="login-card">
    <v-card style="max-width: 20rem" no-body class="elevation-3">
      <v-card-text class="login-card-content">
        <v-img src="../../assets/login.png" />
        <p id="card-title">Welcome ERC!!</p>
        <v-row id="input-row">
          <v-text-field
            id="login-input"
            placeholder="Your ID"
            prepend-icon="mdi-account"
            v-model="id"
            color="primary"
          />
          <v-text-field
            id="login-input"
            placeholder="Your Password"
            prepend-icon="mdi-lock"
            v-model="pw"
            :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPw ? 'text' : 'password'"
            @click:append="showPw = !showPw"
            @keypress.enter="clickLogin"
          />
        </v-row>
        <v-btn height="30px" @click="clickLogin">Login</v-btn>
      </v-card-text>
    </v-card>
    <error-popup :showDialog.sync="isError" :errorMessage="errorMessage" />
  </div>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import ErrorPopup from "../popup/ErrorPopup";

export default {
  components: { ErrorPopup },
  data: () => ({
    showPw: false,
    id: "",
    pw: "",
    isError: false,
    errorMessage: "",
  }),
  methods: {
    clickLogin() {
      axios
        .post(
          "http://49.50.174.126:8080/signin",
          {
            id: this.id,
            pw: enc.encryptValue(this.pw),
          },
          {
            "Content-Type": "application/json; charset=UTF-8",
          }
        )
        .then((response) => this.successLogin(response.data))
        .catch((err) => this.handleError(err.response.data.message));
    },
    successLogin(data) {
      this.$store.state.token = data.token;
      this.$store.state.uid = data.uid;
      this.$store.state.role = data.role;
      this.$store.state.name = data.name;
      if (data.role === "USER") {
        this.$router.push({ name: "lesson" });
      } else if (data.role === "ADMIN") {
        this.$router.push({ name: "account" });
      }
    },
    handleError(err) {
      if (err === "not exist user") {
        this.isError = true;
        this.errorMessage = "등록된 사용자가 아닙니다.";
      } else if (err === "invalid password") {
        this.isError = true;
        this.errorMessage = "비밀번호를 잘못 입력하셨습니다.";
      } else if (err === "suspend user") {
        this.isError = true;
        this.errorMessage = "사용이 정지된 계정입니다.";
      }
    },
  },
};
</script>

<style scoped>
#login-card {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
}
#login-card .v-card__text {
  padding-top: 50px;
  margin-bottom: 15%;
}
#card-title {
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 50px;
}
#input-row {
  margin: 5%;
}
.v-input {
  margin-top: 0;
  padding-top: 0;
}
.v-input /deep/ .v-input__control {
  margin-left: 5%;
}
.v-input /deep/ #login-input {
  margin-left: 5%;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.v-btn {
  max-width: 5rem;
  background-color: #007bff !important;
}
.v-btn /deep/ .v-btn__content {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: white;
}
</style>
