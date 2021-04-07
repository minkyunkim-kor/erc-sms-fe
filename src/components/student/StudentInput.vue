<template>
  <v-dialog v-model="showInputDialog" persistent max-width="640px">
    <v-card>
      <v-card-title>신규 학생 등록</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="6">
            <v-select
              id="add-input"
              :items="categories"
              v-model="detail.category"
              prepend-icon="mdi-checkbox-marked-outline"
              placeholder="구분"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              :return-value.sync="detail.registeredDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  id="add-input"
                  v-model="detail.registeredDate"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  placeholder="등록일"
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="detail.registeredDate"
                :max="new Date().toISOString().substr(0, 10)"
                no-title
                scrollable
                @change="saveTargetDate"
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="detail.name_ko"
              placeholder="한글 이름"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="detail.name_en"
              placeholder="영어 이름"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col cols="6">
            <v-select
              id="add-input"
              prepend-icon="mdi-home-variant-outline"
              :items="lessons"
              v-model="detail.lesson"
              placeholder="클래스"
              hide-details
            />
          </v-col>
          <v-col cols="3">
            <v-select
              id="add-input"
              prepend-icon="mdi-cake-variant"
              :items="grades"
              v-model="detail.grade"
              placeholder="학년"
              hide-details
            />
          </v-col>
          <v-col cols="3" class="justify-center flex-center pl-0">
            <v-radio-group v-model="detail.gender" row hide-details>
              <v-radio label="여자" value="여자"></v-radio>
              <v-radio label="남자" value="남자"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-phone"
              v-model="detail.phoneNo"
              placeholder="연락처"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-school"
              v-model="detail.school"
              placeholder="학교"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col cols="12">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-office-building"
              v-model="detail.addr"
              placeholder="주소"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col cols="12">
            <v-textarea
              id="add-input"
              prepend-icon="mdi-lead-pencil"
              placeholder="메모"
              no-resize
              rows="3"
              clearable
              clear-icon="mdi-close-circle-outline"
              v-model="detail.extra"
            />
          </v-col>
        </v-row>
        <v-row id="button-component" align="baseline">
          <v-spacer />
          <v-col cols="2">
            <v-btn block small @click="closeDialog">취소</v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn block small @click="clickSaveButton">저장</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <error-popup :showDialog.sync="isError" :errorMessage="errorMessage" />
  </v-dialog>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import ErrorPopup from "../popup/ErrorPopup";

export default {
  props: {
    showInputDialog: Boolean,
  },
  components: {
    ErrorPopup,
  },
  created() {
    this.lessons = this.$store.state.lessonInfo.map((l) => l.name);
  },
  watch: {
    showInputDialog(newVal) {
      if (newVal) {
        this.detail = {
          category: "신입생",
          registeredDate: new Date().toISOString().substr(0, 10),
        };
      }
    },
  },
  data: () => ({
    dateMenu: false,
    categories: ["신입생", "재원생", "휴원생", "퇴원생"],
    grades: [
      "미취학",
      "초1",
      "초2",
      "초3",
      "초4",
      "초5",
      "초6",
      "중1",
      "중2",
      "중3",
      "고1",
      "고2",
      "고3",
      "성인",
    ],
    detail: {},
    lessons: [],
    isError: false,
    errorMessage: "",
  }),
  methods: {
    saveTargetDate(date) {
      this.$refs.dateMenu.save(date);
    },
    clickSaveButton() {
      if (!this.checkDataValidate()) {
        return;
      }
      axios
        .post(
          "http://118.67.134.177:8080/student",
          {
            category: this.detail.category,
            registeredDate: this.detail.registeredDate,
            nameKorean: enc.encryptValue(this.detail.name_ko),
            nameEnglish: this.detail.name_en,
            lessonName: this.detail.lesson,
            grade: this.detail.grade,
            gender: this.detail.gender,
            school: this.detail.school,
            contact: enc.encryptValue(this.detail.phoneNo),
            address: enc.encryptValue(this.detail.addr),
            extra: this.detail.extra,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then(() => this.$emit("update:showInputDialog", false));
    },
    closeDialog() {
      this.$emit("update:showInputDialog", false);
    },
    checkDataValidate() {
      let duplicateNames = this.$store.state.students.filter(
        (s) => s.name_ko === this.detail.name_ko
      );
      if (
        this.detail.name_ko === undefined ||
        this.detail.name_ko.trim() === ""
      ) {
        this.isError = true;
        this.errorMessage = "한글 이름을 입력해주세요";
        return false;
      } else if (
        duplicateNames.length > 0 ||
        (duplicateNames.length === 1 &&
          duplicateNames[0].id !== this.selectedStudentId)
      ) {
        this.isError = true;
        this.errorMessage = "이미 입력된 이름입니다.";
        return false;
      }
      return true;
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
#add-component {
  margin-top: 25px;
}
#button-component {
  margin-top: 25px;
}
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.v-input /deep/ .v-label {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.v-input /deep/ .v-input__control {
  margin-left: 5px;
}
.v-input /deep/ #add-input {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.v-input /deep/ .v-select__selections {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.v-input /deep/ .v-select__selection--comma {
  margin-left: 10px;
}
.v-input /deep/ .v-radio {
  margin-right: 5px !important;
}
.v-select-list /deep/ .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
</style>
