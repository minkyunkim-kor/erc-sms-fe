<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0">
        <p id="title">계정 관리</p>
      </v-col>
    </v-row>
    <v-row align="baseline" justify="space-between" class="mt-0">
      <v-col cols="3">
        <v-text-field
          id="account-search"
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="search"
        />
      </v-col>
      <v-col cols="2">
        <v-btn id="add-account" small block @click="clickAddUserButton">
          <v-icon x-small class="mr-1">mdi-plus</v-icon>
          신규 계정 등록
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      :loading="loading"
      loading-text="계정 정보를 불러오는 중입니다."
      disable-sort
      @dblclick:row="dblClickUser"
    />
    <account-input :showDialog.sync="showInputDialog" />
    <account-edit :showDialog.sync="showEditDialog" :target="selectUser" />
  </v-container>
</template>

<script>
import axios from "axios";
import AccountInput from "./AccountInput";
import AccountEdit from "./AccountEdit";

export default {
  components: { AccountInput, AccountEdit },
  created() {
    this.loadUserInfo();
  },
  watch: {
    showInputDialog(newVal) {
      if (!newVal) {
        this.loadUserInfo();
      }
    },
    showEditDialog(newVal) {
      if (!newVal) {
        this.loadUserInfo();
      }
    },
  },
  data: () => ({
    users: [],
    search: "",
    loading: false,
    headers: [
      { text: "이름", align: "center", value: "teacher" },
      { text: "지점명", align: "center", value: "name" },
      { text: "로그인 ID", align: "center", value: "id" },
      { text: "상태", align: "center", value: "suspendYn" },
    ],
    showInputDialog: false,
    showEditDialog: false,
    selectUser: "",
  }),
  methods: {
    loadUserInfo() {
      this.users.length = 0;
      this.loading = true;
      axios
        .get("http://49.50.174.126:8080/user", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((res) => {
          res.data.forEach((user) => {
            this.users.push({
              userId: user.userId,
              id: user.id,
              teacher: user.teacher,
              name: user.name,
              suspendYn: user.suspendYn === "N" ? "사용" : "중지",
            });
          });
          this.loading = false;
        });
    },
    clickAddUserButton() {
      this.showInputDialog = true;
    },
    dblClickUser(item, select) {
      this.selectUser = select.item.userId;
      this.showEditDialog = true;
    },
  },
};
</script>

<style scoped>
.v-input /deep/ #account-search {
  margin-left: 5%;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
#add-account {
  padding-left: 3%;
  padding-right: 3%;
  background-color: #00c089;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: white;
}
</style>
