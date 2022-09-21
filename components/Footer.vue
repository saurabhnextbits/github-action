<template>
   <v-footer
      :absolute="!fixed"
      app
    >
      <span class="text-body-2 text-sm-body-1">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
</template>

<script>
export default {
  data () {
    return {
      fixed: true
    }
  }
}
</script>
