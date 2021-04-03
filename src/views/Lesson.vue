<template>
  <div class="container fill" style="height: 100%">
    <side-menu />
    <lesson-view />
  </div>
</template>

<script>
import LessonView from "../components/lesson/LessonView";
import SideMenu from "../components/menu/SideMenu";

export default {
  components: {
    LessonView,
    SideMenu,
  },
};
</script>

<style scoped>
.fill {
  min-height: 100%;
  min-width: 100%;
  align-content: center;
  margin-left: 0%;
  margin-right: 0%;
}
</style>
