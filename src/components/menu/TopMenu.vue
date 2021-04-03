<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <h1>{{ title }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>