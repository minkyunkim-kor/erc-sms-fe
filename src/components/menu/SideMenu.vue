<template>
  <div>
    <v-app-bar :color="barColor" app elevation="0" dense>
      <v-spacer></v-spacer>
      <v-btn small color="#99B8CA" @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-navigation-drawer app bottom permanent width="200px">
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="../../assets/logo_2.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>ERC 영어독서클럽</v-list-item-title>
            <v-list-item-subtitle>({{ name }})</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list>
        <v-list-group no-action prepend-icon="mdi-home-variant-outline">
          <v-list-item-content slot="activator">
            <v-list-item-title>클래스 관리</v-list-item-title>
          </v-list-item-content>
          <v-list-item v-for="(item, i) in classMenu" :key="i" :to="item.to">
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-list>
        <v-list-group no-action prepend-icon="mdi-account-details-outline">
          <v-list-item-content slot="activator">
            <v-list-item-title>학생 관리</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-for="(name, i) in studentMenu" :key="i">
            <v-list-item-title v-text="name" />
          </v-list-item-content>
        </v-list-group>
      </v-list>
      <v-list>
        <v-list-group no-action prepend-icon="mdi-file-document-outline">
          <v-list-item-content slot="activator">
            <v-list-item-title>학습 관리</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-for="(name, i) in learningMenu" :key="i">
            <v-list-item-title v-text="name" />
          </v-list-item-content>
        </v-list-group>
      </v-list>
      <v-list>
        <v-list-group no-action prepend-icon="mdi-credit-card-multiple-outline">
          <v-list-item-content slot="activator">
            <v-list-item-title>수납 관리</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-for="(name, i) in paymentMenu" :key="i">
            <v-list-item-title v-text="name" />
          </v-list-item-content>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    classMenu: [{ title: "클래스 정보", to: "/lesson" }],
    studentMenu: ["학생 정보", "학생 현황"],
    learningMenu: [
      "레벨테스트",
      "전체 평가데이터",
      "일별 평가데이터 입력",
      "월간 보고서",
    ],
    paymentMenu: [
      "수납현황",
      "수강료 입력",
      "미납금 현황",
      "매출 현황",
      "현금영수증 정보",
    ],
    barColor: "#f4f6f9",
  }),
  computed: {
    name: function () {
      return this.$store.state.name;
    },
  },
  methods: {
    logout() {
      this.$router.push({ name: "login" });
    },
    goToLessonView() {
      this.$router.push({ name: "lesson" });
    },
  },
};
</script>

<style scoped>
.v-btn {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 10px !important;
  color: white !important;
}
.v-navigation-drawer {
  background-color: #0058a2 !important;
}
.v-navigation-drawer /deep/ .v-navigation-drawer__prepend {
  background-color: #00437a !important;
}
.v-navigation-drawer /deep/ .v-navigation-drawer__prepend .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 14px !important;
  color: white !important;
  margin-left: 5%;
}
.v-navigation-drawer
  /deep/
  .v-navigation-drawer__prepend
  .v-list-item__subtitle {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 11px !important;
  color: white !important;
  margin-left: 5%;
  font-weight: 100;
}
.v-navigation-drawer
  /deep/
  .v-navigation-drawer__content
  .v-list-group__header
  .v-list-item__icon {
  margin-right: 0%;
}
.v-navigation-drawer
  /deep/
  .v-navigation-drawer__content
  .v-list-group__header
  .v-list-item__icon
  .v-icon {
  color: white;
}
.v-navigation-drawer
  /deep/
  .v-navigation-drawer__content
  .v-list-group__header
  .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 14px !important;
  color: white !important;
  margin-left: 15%;
}
.v-navigation-drawer
  /deep/
  .v-navigation-drawer__content
  .v-list-group__items
  .v-list-item {
  padding-left: 0px;
}
.v-navigation-drawer
  /deep/
  .v-navigation-drawer__content
  .v-list-group__items
  .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 12px !important;
  color: white !important;
  margin-left: 30%;
  font-weight: 100;
}
</style>
