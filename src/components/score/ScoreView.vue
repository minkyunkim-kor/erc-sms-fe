<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">전체 평가 데이터</p>
      </v-col>
    </v-row>
    <v-row align="baseline" justify="start" class="mt-0">
      <v-col cols="3">
        <v-text-field
          id="search"
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="search"
        />
      </v-col>
      <v-col cols="1">
        <v-spacer />
      </v-col>
      <v-col cols="2">
        <v-menu
          ref="startDateMenu"
          v-model="startDateMenu"
          :close-on-content-click="false"
          :return-value.sync="startDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startDate"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              id="calendar"
              class="picker"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDate"
            no-title
            scrollable
            @change="saveStartDate"
          />
        </v-menu>
      </v-col>
      <v-col cols="2">
        <v-menu
          ref="endDateMenu"
          v-model="endDateMenu"
          :close-on-content-click="false"
          :return-value.sync="endDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endDate"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              id="calendar"
              class="picker"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDate"
            :min="startDate"
            :max="new Date().toISOString().substr(0, 10)"
            no-title
            scrollable
            @change="saveEndDate"
          />
        </v-menu>
      </v-col>
      <v-col cols="2">
        <v-btn id="add-btn" small block @click="clickDailyInputButton">
          <v-icon x-small class="mr-1">mdi-plus</v-icon>
          일별 입력
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn id="manual-btn" small block @click="clickManualInputButton">
          <v-icon x-small class="mr-1">mdi-plus</v-icon>
          학생별 입력
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="scoreInfo"
      :search="search"
      :loading="loading"
      loading-text="평가 데이터를 불러오는 중입니다."
      disable-sort
      @dblclick:row="dblClickItem"
    >
      <template v-slot:no-data>
        <p id="no-data">해당 기간에 입력된 평가데이터가 없습니다.</p>
      </template>
      <template v-slot:[`header.scoreA`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">A</span>
          </template>
          <span>Attendance</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreH`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">H</span>
          </template>
          <span>Homework</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreP`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">P</span>
          </template>
          <span>Participation</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreM`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">M</span>
          </template>
          <span>Manner</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreD`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">D</span>
          </template>
          <span>Decoding/Phonics, Sight Word</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreOF`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">OF</span>
          </template>
          <span>Oral Reading Fluency</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreC`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">C</span>
          </template>
          <span>Comprehension</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreG`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">G</span>
          </template>
          <span>Grammar</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreW`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">W</span>
          </template>
          <span>Writing</span>
        </v-tooltip>
      </template>
      <template v-slot:[`header.scoreS`]="{}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">S</span>
          </template>
          <span>Speaking</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <score-daily-input :showDailyInputDilog.sync="showDailyInputDilog" />
    <score-maunal-input :showManualDialog.sync="showManualDialog" />
    <score-edit
      :showEditDialog.sync="showEditDialog"
      :selectedId="selectedItem.id"
      :targetDate="selectedItem.date"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import ScoreDailyInput from "./ScoreDailyInput";
import ScoreMaunalInput from "./ScoreMaunalInput";
import ScoreEdit from "./ScoreEdit";

export default {
  components: { ScoreDailyInput, ScoreMaunalInput, ScoreEdit },
  created() {
    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 3);
    this.startDate = this.startDate.toISOString().substring(0, 10);
    this.endDate = new Date();
    this.endDate = this.endDate.toISOString().substring(0, 10);
    this.loadScoreData();
  },
  watch: {
    startDate(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadScoreData();
      }
    },
    endDate(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadScoreData();
      }
    },
    showDailyInputDilog(newVal) {
      if (!newVal) {
        this.loadScoreData();
      }
    },
    showManualDialog(newVal) {
      if (!newVal) {
        this.loadScoreData();
      }
    },
    showEditDialog(newVal) {
      if (!newVal) {
        this.loadScoreData();
      }
    },
  },
  data: () => ({
    showDailyInputDilog: false,
    showManualDialog: false,
    showEditDialog: false,
    selectedItem: {},
    search: "",
    scoreInfo: [],
    startDateMenu: false,
    startDate: "",
    endDateMenu: false,
    endDate: "",
    headers: [
      { text: "이름", align: "center", value: "name" },
      { text: "수업일", align: "center", value: "lessonDate" },
      { text: "수업 레벨", align: "center", value: "lessonLevel" },
      { text: "A", align: "center", value: "scoreA", filterable: false },
      { text: "H", align: "center", value: "scoreH", filterable: false },
      { text: "P", align: "center", value: "scoreP", filterable: false },
      { text: "M", align: "center", value: "scoreM", filterable: false },
      { text: "D", align: "center", value: "scoreD", filterable: false },
      { text: "OF", align: "center", value: "scoreOF", filterable: false },
      { text: "C", align: "center", value: "scoreC", filterable: false },
      { text: "G", align: "center", value: "scoreG", filterable: false },
      { text: "W", align: "center", value: "scoreW", filterable: false },
      { text: "S", align: "center", value: "scoreS", filterable: false },
      { text: "담당 선생님", align: "center", value: "teacher" },
    ],
    loading: false,
  }),
  methods: {
    saveStartDate(date) {
      this.$refs.startDateMenu.save(date);
      this.startDateMenu = false;
    },
    saveEndDate(date) {
      this.$refs.endDateMenu.save(date);
      this.endDateMenu = false;
    },
    loadScoreData() {
      this.loading = true;
      axios
        .get(
          "http://49.50.174.126:8080/student/score?startDate=" +
            this.startDate +
            "&endDate=" +
            this.endDate,
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
              "erc-user-id": this.$store.state.uid,
            },
          }
        )
        .then((response) => {
          this.scoreInfo = [];
          response.data.forEach((score) => {
            this.scoreInfo.push({
              studentId: score.studentId,
              studentScoreId: score.studentScoreId,
              name: enc.decryptValue(score.name),
              lessonDate: score.lessonDate,
              lessonLevel: score.lessonLevel,
              scoreA: score.scoreA,
              scoreH: score.scoreH,
              scoreP: score.scoreP,
              scoreM: score.scoreM,
              scoreD: score.scoreD,
              scoreOF: score.scoreOF,
              scoreC: score.scoreC,
              scoreG: score.scoreG,
              scoreW: score.scoreW,
              scoreS: score.scoreS,
              teacher:
                score.teacher !== "" && score.teacher !== null
                  ? enc.decryptValue(score.teacher)
                  : "",
            });
          });
          this.$store.state.scoreInfo = this.scoreInfo;
          this.loading = false;
        });
    },
    clickDailyInputButton() {
      this.showDailyInputDilog = true;
    },
    clickManualInputButton() {
      this.showManualDialog = true;
    },
    dblClickItem(item, select) {
      this.selectedItem = {
        id: select.item.studentId,
        date: select.item.lessonDate,
      };
      this.showEditDialog = true;
    },
  },
};
</script>

<style scoped>
.v-input /deep/ #search {
  margin-left: 5%;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
}
.v-input /deep/ #calendar {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: center;
}
#add-btn {
  padding-left: 3%;
  padding-right: 3%;
  background-color: #00c089;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: white;
}
#manual-btn {
  padding-left: 3%;
  padding-right: 3%;
  background-color: grey;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: white;
}
</style>
