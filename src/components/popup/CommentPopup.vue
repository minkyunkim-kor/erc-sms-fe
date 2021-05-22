<template>
  <v-dialog v-model="showDialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <p id="popup-title">Teacher's Comment</p>
      </v-card-title>
      <v-card-text>
        <v-textarea
          no-resize
          rows="8"
          clearable
          clear-icon="mdi-close-circle-outline"
          outlined
          v-model="comment"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn id="btn-cancel" text @click="closeDialog">취소</v-btn>
        <v-btn id="btn-save" text @click="saveComment">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    showDialog(newVal) {
      if (newVal) {
        if (this.$store.state.comment !== undefined) {
          this.comment = String(this.$store.state.comment);
          this.comment = this.comment.split("<br />").join("\n");
        } else {
          this.comment = "코멘트를 입력해 주세요";
        }
      }
    },
  },
  data: () => ({
    comment: "",
  }),
  methods: {
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    saveComment() {
      this.comment = this.comment.split("\n").join("<br />");
      var count = (this.comment.match(/<br \/>/g) || []).length;
      if (count < 6) {
        for (var i = count; i < 6; i++) {
          this.comment += "<br />";
        }
      }
      this.$store.state.comment = this.comment;
      this.$emit("update:showDialog", false);
    },
  },
};
</script>

<style scoped>
#popup-title {
  font-family: "NanumSquareRound", Avenir, Helvetica, Arial, sans-serif !important;
  font-size: 16px !important;
  color: #1c88e4 !important;
  font-weight: 800;
  margin-bottom: 0px;
}
</style>
