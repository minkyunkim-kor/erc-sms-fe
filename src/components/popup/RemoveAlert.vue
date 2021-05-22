<template>
  <v-dialog v-model="showDialog" persistent max-width="340px">
    <v-card>
      <v-card-title>
        <v-icon id="alert">mdi-close-circle-outline</v-icon>
        <p id="title">정말로 삭제 하시겠습니까?</p>
      </v-card-title>
      <v-card-subtitle v-if="component === 'student'">
        <p id="subtitle">
          해당 학생 정보를 삭제할 경우, 인적정보 뿐만 아니라 평가데이터, 학습
          진도, 수납 및 미납 내역, 현금영수증 등의 모든 정보가 삭제됩니다. 한 번
          삭제된 정보는 복구가 불가능합니다.
        </p>
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer />
        <v-btn id="action-btn" text @click="clickCancel">취소</v-btn>
        <v-btn id="action-btn" text @click="clickOk">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    confirmRemove: {
      type: Boolean,
      default: false,
    },
    component: {
      type: String,
      default: "",
    },
    target: {
      type: String,
      default: "",
    },
    targetDate: {
      type: String,
      default: "",
    },
  },
  methods: {
    clickCancel() {
      this.$emit("update:showDialog", false);
    },
    clickOk() {
      if (this.component !== "score") {
        axios
          .delete(
            "http://49.50.174.126:8080/" + this.component + "/" + this.target,
            {
              headers: {
                Authorization: "Bearer " + this.$store.state.token,
                "erc-user-id": this.$store.state.uid,
              },
            }
          )
          .then(() => {
            this.$emit("update:showDialog", false);
            this.$emit("update:confirmRemove", true);
          });
      } else {
        axios
          .delete(
            "http://49.50.174.126:8080/student/score?studentId=" +
              this.target +
              "&targetDate=" +
              this.targetDate,
            {
              headers: {
                Authorization: "Bearer " + this.$store.state.token,
                "erc-user-id": this.$store.state.uid,
              },
            }
          )
          .then(() => {
            this.$emit("update:showDialog", false);
            this.$emit("update:confirmRemove", true);
          });
      }
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
.v-card .v-card__subtitle {
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
#subtitle {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 12px !important;
  color: white !important;
  margin-bottom: 0px;
}
#alert {
  color: white !important;
  margin-left: 0px;
  margin-right: 10px;
}
#action-btn {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: bolder;
}
</style>
