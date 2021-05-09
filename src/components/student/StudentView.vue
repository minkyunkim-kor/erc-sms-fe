<template>
  <v-container style="max-width: 100%; padding: 0%">
    <v-row align="start">
      <v-col cols="2" class="pt-0 pb-2">
        <p id="title">학생 정보</p>
      </v-col>
    </v-row>
    <v-row align="baseline" justify="space-between" class="mt-0">
      <v-col cols="3">
        <v-text-field
          id="search"
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="search"
        />
      </v-col>
      <v-col cols="2">
        <v-btn id="add-btn" small block @click="clickAddStudent">
          <v-icon x-small class="mr-1">mdi-plus</v-icon>
          신규 학생 등록
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="studentInfo"
      :search="search"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
      @dblclick:row="dblClickStudent"
    >
      <template v-slot:[`item.gender`]="{ item }">
        <v-row justify="center" align="center">
          <v-img
            v-if="item.gender === '남자'"
            src="../../assets/boy.png"
            max-width="30px"
          />
          <v-img v-else src="../../assets/girl.png" max-width="30px" />
        </v-row>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <p id="address">{{ item.addr }}</p>
        </td>
      </template>
    </v-data-table>
    <student-input :showInputDialog.sync="showInputDialog" />
    <student-edit
      :showEditDialog.sync="showEditDialog"
      :selectedStudentId="selectStudent"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import enc from "../util/enc";
import StudentInput from "./StudentInput";
import StudentEdit from "./StudentEdit";

export default {
  components: {
    StudentInput,
    StudentEdit,
  },
  created() {
    this.loadStudentData();
  },
  watch: {
    showInputDialog(newVal) {
      if (!newVal) {
        this.loadStudentData();
      }
    },
    showEditDialog(newVal) {
      if (!newVal) {
        this.loadStudentData();
      }
    },
  },
  data: () => ({
    showInputDialog: false,
    showEditDialog: false,
    selectStudent: "",
    search: "",
    expanded: [],
    singleExpand: true,
    headers: [
      {
        text: "구분",
        sortable: false,
        align: "center",
        value: "category",
      },
      {
        text: "성별",
        sortable: false,
        align: "center",
        value: "gender",
      },
      {
        text: "한글 이름",
        sortable: false,
        align: "center",
        value: "name_ko",
      },
      {
        text: "영어 이름",
        sortable: false,
        align: "center",
        value: "name_en",
      },
      {
        text: "학년",
        sortable: false,
        align: "center",
        value: "grade",
      },
      {
        text: "클래스",
        sortable: false,
        align: "center",
        value: "lesson",
      },
      {
        text: "등록일",
        sortable: false,
        align: "center",
        value: "registeredDate",
      },
      {
        text: "학교",
        sortable: false,
        align: "center",
        value: "school",
      },
      {
        text: "연락처",
        sortable: false,
        align: "center",
        value: "phoneNo",
      },
      {
        text: "주소",
        sortable: false,
        value: "data-table-expand",
      },
    ],
    studentInfo: [],
  }),
  methods: {
    loadStudentData() {
      this.studentInfo.length = 0;
      axios
        .get("http://49.50.174.126:8080/student", {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
            "erc-user-id": this.$store.state.uid,
          },
        })
        .then((response) => {
          response.data.forEach((student) => {
            this.studentInfo.push({
              id: student.studentId,
              category: student.category,
              name_ko: enc.decryptValue(student.nameKorean),
              name_en: student.nameEnglish,
              gender: student.gender,
              grade: student.grade,
              lesson: student.lessonName,
              registeredDate: student.registeredDate,
              school: student.school,
              phoneNo: enc.decryptValue(student.contact),
              addr: enc.decryptValue(student.address),
            });
          });
          this.$store.state.students = this.studentInfo;
          this.$forceUpdate();
        });
    },
    clickAddStudent() {
      this.showInputDialog = true;
    },
    dblClickStudent(item, select) {
      this.selectStudent = select.item.id;
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
#add-btn {
  padding-left: 3%;
  padding-right: 3%;
  background-color: #00c089;
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: white;
}
#address {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif;
  font-size: 13px;
  text-align: start;
  margin-bottom: 0px;
}
</style>
