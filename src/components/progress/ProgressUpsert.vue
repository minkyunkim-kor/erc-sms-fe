<template>
  <v-dialog v-model="showDialog" persistent max-width="900px">
    <v-card>
      <v-card-title id="card-upsert-title">학습 진도 입력</v-card-title>
      <v-card-text>
        <v-row id="add-component" align="baseline">
          <v-col cols="3">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-account"
              v-model="details.name"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              id="add-input"
              prepend-icon="mdi-star-circle-outline"
              v-model="details.current"
              readonly
              hide-details
            />
          </v-col>
        </v-row>
        <v-row align="baseline">
          <v-col cols="4">
            <h2 id="label">
              <v-icon class="mr-3">mdi-book-open-page-variant-outline</v-icon>
              상세 학습 진도
            </h2>
          </v-col>
        </v-row>
        <v-row v-for="(row, rIndex) in cols" :key="rIndex">
          <v-col
            v-for="(col, cIndex) in row"
            :key="cIndex"
            :cols="col.size"
            :style="getStyle(col.label)"
          >
            <p id="level" v-if="rIndex % 9 === 0">{{ col.label }}</p>
            <v-btn
              block
              tile
              id="level-button"
              v-else
              :color="getColor(col.level, col.label)"
              @click="clickProgress(col.level, col.label)"
            >
              {{ col.label }}
            </v-btn>
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
            <v-btn id="btn-save" block small @click="saveProgress">
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
import enc from "../util/enc";

export default {
  props: {
    showDialog: Boolean,
    target: String,
  },
  created() {
    this.getList();
  },
  watch: {
    showDialog(newVal) {
      if (newVal) {
        this.loadProgress();
      }
    },
  },
  data: () => ({
    details: {},
    level_a: [
      { name: "A", max: 8, size: 1 },
      { name: "B", max: 8, size: 1 },
      { name: "C", max: 8, size: 1 },
      { name: "PR", max: 6, size: 1 },
      { name: "D", max: 8, size: 1 },
      { name: "E", max: 8, size: 1 },
      { name: "F", max: 8, size: 1 },
      { name: "G", max: 6, size: 1 },
      { name: "H", max: 8, size: 1 },
      { name: "I", max: 8, size: 2 },
      { name: "J", max: 8, size: 2 },
      { name: "K", max: 8, size: 2 },
    ],
    cols: [],
  }),
  methods: {
    getList() {
      for (var row = 0; row < 18; row++) {
        var col = [];
        for (var c = 0; c < 6; c++) {
          var level = this.level_a[Math.floor(row / 9) * 6 + c];
          if (row % 9 === 0) {
            col.push({
              level: level.name,
              label: level.name + " Level",
              size: 2,
            });
          } else {
            var label_row = row - Math.floor(row / 9) * 9;
            if (label_row > level.max) {
              col.push({
                label: "",
                size: level.size,
              });
              col.push({
                label: "",
                size: level.size,
              });
            } else {
              if (level.size === 2) {
                col.push({
                  level: level.name,
                  label: label_row,
                  size: 2,
                });
              } else {
                col.push({
                  level: level.name,
                  label: label_row + "-1",
                  size: level.size,
                });
                col.push({
                  level: level.name,
                  label: label_row + "-2",
                  size: level.size,
                });
              }
            }
          }
        }
        this.cols.push(col);
      }
    },
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    loadProgress() {
      this.details = {
        progresses: new Array(),
      };
      axios
        .get("http://49.50.174.126:8080/student/" + this.target + "/progress", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          this.details = {
            studentId: response.data.studentId,
            category: response.data.category,
            name: this.getName(
              enc.decryptValue(response.data.name),
              response.data.nameEn
            ),
            current: response.data.currentLevel,
            progresses: response.data.progresses,
          };
        });
    },
    saveProgress() {
      axios
        .post(
          "http://49.50.174.126:8080/student/progress",
          {
            studentId: this.target,
            progresses: this.details.progresses,
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
    getName(name, name_en) {
      return name + "(" + name_en + ")";
    },
    getStyle(label) {
      if (label === "") {
        return "visibility:hidden; height: 40px";
      } else if (String(label).length === 1) {
        return {
          paddingTop: "1px",
          paddingBottom: "1px",
          height: "40px",
        };
      } else if (String(label).includes("-1")) {
        return {
          paddingTop: "1px",
          paddingBottom: "1px",
          paddingRight: "1px",
          height: "40px",
        };
      } else if (String(label).includes("-2")) {
        return {
          paddingTop: "1px",
          paddingBottom: "1px",
          paddingLeft: "1px",
          height: "40px",
        };
      } else {
        return {
          paddingTop: "15px",
          paddingBottom: "1px",
          paddingRight: "1px",
          paddingLeft: "1px",
          height: "40px",
        };
      }
    },
    getColor(level, label) {
      var index = this.details.progresses.indexOf(level + label);
      if (index !== -1) {
        switch (level) {
          case "A":
            return "#ff2929";
          case "B":
            return "#fe860e";
          case "C":
            return "#ffed01";
          case "PR":
            return "#8f51e1";
          case "D":
            return "#1dbd5e";
          case "E":
            return "#11b0ff";
          case "F":
            return "#314a9b";
          case "G":
            return "#91682b";
          case "H":
            return "#fd6927";
          case "I":
            return "#84e028";
          case "J":
            return "#0077d0";
          case "K":
            return "#e94964";
        }
      } else {
        return "white";
      }
    },
    clickProgress(level, label) {
      var index = this.details.progresses.indexOf(level + label);
      if (index === -1) {
        this.details.progresses.push(level + label);
      } else {
        this.details.progresses.splice(index, 1);
      }
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
#label {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  color: black;
  font-size: 15px;
  text-align: start;
}
#level {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  color: black;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0px;
}
#level-button {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  color: black;
  font-size: 13px;
  text-align: center;
  margin-bottom: 0px;
  height: 100%;
}
.v-input /deep/ .v-input__control {
  margin-left: 5px;
}
.v-input /deep/ #add-input {
  margin-left: 10px;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  color: black;
  font-size: 13px;
  text-align: start;
}
</style>
