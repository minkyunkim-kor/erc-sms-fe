<template>
  <v-dialog v-model="showEditDialog" persistent max-width="600px">
    <v-card>
      <v-card-title id="card-edit-title">클래스 정보 수정</v-card-title>
      <v-card-text>
        <v-row id="add-component">
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-home-variant-outline"
              v-model="name"
              placeholder="클래스 이름"
              required
              :rules="nameRules"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="teacherName"
              placeholder="담당 선생님"
              required
              :rules="nameRules"
            />
          </v-col>
        </v-row>
        <v-row v-for="(detail, i) in details" :key="i" align="baseline">
          <v-col cols="1" id="append-icon">
            <v-icon v-if="i === 0">mdi-calendar-clock</v-icon>
          </v-col>
          <v-col cols="4" class="px-0 py-1">
            <v-select
              :items="weekdays"
              v-model="detail.weekday"
              placeholder="수업요일"
              hide-details=""
            />
          </v-col>
          <v-col cols="3">
            <vue-timepicker
              placeholder="시작 시간"
              :hour-range="[[9, 22]]"
              :minute-interval="10"
              hide-disabled-hours
              close-on-complete
              v-model="detail.start"
            />
          </v-col>
          <v-col cols="3">
            <vue-timepicker
              placeholder="끝 시간"
              :hour-range="[[9, 22]]"
              :minute-interval="10"
              hide-disabled-hours
              close-on-complete
              v-model="detail.end"
            />
          </v-col>
          <v-col cols="1">
            <v-btn
              id="plus-button"
              x-small
              block
              fab
              width="25px"
              height="25px"
              class="pa-0 elevation-0"
              v-if="i === 0"
              @click="addDetail"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              id="minus-button"
              x-small
              block
              fab
              width="25px"
              height="25px"
              class="pa-0 elevation-0"
              v-else
              @click="removeDetail(i)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row justify="end" id="button-component">
          <v-spacer />
          <v-col cols="2">
            <v-btn id="btn-cancel" block small @click="closeDialog">
              취소
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn id="btn-remove" block small @click="removeLesson">
              삭제
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn id="btn-save" block small @click="saveLesson">저장</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <error-popup :showDialog.sync="isError" :errorMessage="errorMessage" />
    <remove-alert
      :showDialog.sync="removeDialog"
      :confirmRemove.sync="confirmRemove"
      component="lesson"
      :target="selectLessonId"
    />
  </v-dialog>
</template>

<script>
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import axios from "axios";
import enc from "../util/enc";
import ErrorPopup from "../popup/ErrorPopup";
import RemoveAlert from "../popup/RemoveAlert";

export default {
  props: {
    showEditDialog: Boolean,
    selectLessonId: String,
  },
  watch: {
    showEditDialog: function (newVal) {
      if (newVal) {
        this.loadLessonData();
      }
    },
    confirmRemove: function (newVal) {
      if (newVal) {
        this.closeDialog();
      }
    },
  },
  components: {
    VueTimepicker,
    ErrorPopup,
    RemoveAlert,
  },
  data: () => ({
    name: "",
    teacherName: "",
    details: [
      {
        weekday: "",
        start: "",
        end: "",
      },
    ],
    weekdays: ["월", "화", "수", "목", "금", "토", "일"],
    nameRules: [(v) => !!v || "필수 입력 값입니다."],
    valid: false,
    isError: false,
    errorMessage: "",
    removeDialog: false,
    confirmRemove: false,
  }),
  methods: {
    loadLessonData() {
      this.details.length = 0;
      axios
        .get("http://49.50.174.126:8080/lesson/" + this.selectLessonId, {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          this.name = response.data.name;
          this.teacherName = enc.decryptValue(response.data.teacher);
          response.data.times.forEach((time) => {
            this.details.push({
              weekday: time.weekday,
              start: time.start,
              end: time.end,
            });
          });
        });
      this.confirmRemove = false;
    },
    saveLesson() {
      if (!this.checkDataValidate()) {
        return;
      }
      axios
        .post(
          "http://49.50.174.126:8080/lesson/" + this.selectLessonId,
          {
            name: this.name,
            teacherName: enc.encryptValue(this.teacherName),
            times: this.details,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then(() => {
          this.$emit("update:showEditDialog", false);
        })
        .catch((err) => this.handleError(err.response.data.message));
    },
    removeLesson() {
      this.removeDialog = true;
    },
    closeDialog() {
      this.$emit("update:showEditDialog", false);
    },
    addDetail() {
      this.details.push({
        weekday: "",
        start: "",
        end: "",
      });
    },
    removeDetail(index) {
      this.details.splice(index, 1);
    },
    handleError(err) {
      console.log(err);
      if (err === "duplicate lesson name") {
        this.isError = true;
        this.errorMessage = "이미 사용된 반 이름입니다.";
      } else if (err === "invalid weekday value") {
        this.isError = true;
        this.errorMessage = "선택하지 않은 수업요일이 있습니다.";
      }
    },
    checkDataValidate() {
      var valid = true;
      if (this.name === "" || this.name.trim() === "") {
        this.isError = true;
        this.errorMessage = "클래스 이름을 입력해주세요";
        valid = false;
      } else if (this.teacherName === "" || this.teacherName.trim() === "") {
        this.isError = true;
        this.errorMessage = "담당 선생님을 입력해주세요";
        valid = false;
      } else {
        this.details.forEach((detail) => {
          if (detail.weekday === "" || detail.weekday.trim() === "") {
            this.isError = true;
            this.errorMessage = "수업 요일을 입력해주세요";
            valid = false;
          } else if (detail.start === "" || detail.start.trim() === "") {
            this.isError = true;
            this.errorMessage = "수업 시작 시간을 입력해주세요";
            valid = false;
          } else if (detail.start === "" || detail.start.trim() === "") {
            this.isError = true;
            this.errorMessage = "수업 끝 시간을 입력해주세요";
            valid = false;
          }
        });
      }
      return valid;
    },
  },
};
</script>

<style scoped>
#add-component {
  margin-top: 20px;
  margin-bottom: 15px;
}
#button-component {
  margin-top: 100px;
}
#plus-button {
  background-color: #1d89e4 !important;
}
#plus-button /deep/ .v-btn__content {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: white;
}
#minus-button {
  background-color: #ee534f !important;
}
#minus-button /deep/ .v-btn__content {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: white;
}
.v-input {
  margin-top: 0;
  padding-top: 0;
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
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.v-card .v-card__title {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
.v-select-list /deep/ .v-list-item__title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
.vue__time-picker {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
}
.v-input /deep/ .v-messages__message {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 11px !important;
}
</style>
