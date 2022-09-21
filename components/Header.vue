<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list id="header-list" >
        <v-list-item class="main-logo">
          <v-list-item-action>
            <nuxt-link to="/" class="small-logo">
                <img src="/nb-logo.svg" alt="" class="logo-sm">
            </nuxt-link>
          </v-list-item-action>
          <v-list-item-content>
            <nuxt-link to="/">
             <img src="/nextbits-full.svg" alt="" class="logo-lg">
            </nuxt-link>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" class="text-body-2 text-sm-body-1" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :key="6"
          @click="dialogLogout = true"
        >
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="text-body-2 text-sm-body-1" >Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      elevation="2"
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"  />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-spacer />
      <v-switch
        v-model="darkmode"
        class="d-flex align-center"
        inset
        hide-details
        color="orange"
        :label="`Dark Mode`"
      ></v-switch>
      <!-- <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
     <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-dialog v-model="dialogLogout" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to Logout?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="dialogLogout = false">Cancel</v-btn>
              <v-btn color="primary" @click="logout">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
      </v-dialog>
  </div>
  
</template>

<style scoped>
#header-list{
  padding-top: 0;
}

  .main-logo .v-list-item__content {
    padding: 0;
  }

  .main-logo .small-logo{
    display: flex;
    align-items: center;
  }

  .logo-sm {
    height: 30px;
    margin-left: -3px;
  }

  .logo-lg {
    max-width: 120px;
  }
</style>

<script>

export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      darkmode: false,
      dialogLogout:false,
      logoItem : {
        title: 'Nextbits',
        to:'/'
      },
      items: [
        {
          icon: 'mdi-calendar-clock',
          title: 'Time',
          to: '/'
        },
         {
          icon: 'mdi-file-chart-outline',
          title: 'Reports',
          to: '/reports'
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          to: '/settings'
        },
        {
          icon: 'mdi-account',
          title: 'Profile',
          to: '/profile'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  // middleware: 'authenticated',
  watch: {
    darkmode (oldval, newval) {
      this.handledarkmode()
    }
  },
  created () {
    if (process.browser) {
      if (localStorage.getItem('DarkMode')) {
        const cookieValue = localStorage.getItem('DarkMode') === 'true'
        this.darkmode = cookieValue
      } else {
        this.handledarkmode()
      }
    }
  },
  methods: {
    handledarkmode () {
      if (process.browser) {
        if (this.darkmode === true) {
          this.$vuetify.theme.dark = true
          localStorage.setItem('DarkMode', true)
        } else if (this.darkmode === false) {
          this.$vuetify.theme.dark = false
          localStorage.setItem('DarkMode', false)
        }
      }
    },
    async logout () {
      await this.$auth.logout()
    }
  }
}
</script>
