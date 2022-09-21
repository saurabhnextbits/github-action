<template>
  <v-app>
    <Header />
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
    <Footer />
  </v-app>
</template>

<style scoped>
  .container {
    max-width: 100%;
    padding: 20px;
  }
</style>

<script>

export default {
  name: 'DefaultLayout'
}
</script>
