<template>
  <h1>Sign out</h1>
</template>

<script>
export default {
  beforeMount() {
    this.logout();
  },
  methods : {
    async logout () {
      await this.$auth.logout()
    }
  }
}
</script>
