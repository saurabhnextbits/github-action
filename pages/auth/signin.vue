<template>
         <v-container fluid fill-height>
            <v-row class="align-center justify-center pa-2 pa-sm-0">
               <v-col  cols="12" sm="8" md="5" lg="4" xl="3">
                  <v-card class="elevation-12">
                     <v-card-title>
                        <v-layout align-center justify-space-between>
                           <h1 class="text-h6 text-sm-h5 font-weight-regular">
                             Sign In   {{process.env.TEST}}
                           </h1>
                            <img src="/nextbits-full.svg" height="35px" alt="" class="logo-lg">
                        </v-layout>
                     </v-card-title>
                     <v-divider></v-divider>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                              append-icon="mdi-account"
                              name="username"
                              label="User Name"
                              type="text"
                              hide-details="auto"
                              filled
                              v-model="auth.email"
                              class="pt-3 pb-3"
                              clearable
                              required
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              append-icon="mdi-lock"
                              name="password"
                              label="Password"
                              type="password"
                              hide-details="auto"
                              class="pt-3 pb-3"
                              filled
                              v-model="auth.password"
                              clearable
                              required
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-divider></v-divider>
                     <v-card-actions block>
                       <v-btn block color="primary" class="text-caption text-sm-button font-weight-medium" @click="login">Login</v-btn>
                     </v-card-actions>
                     <v-card-actions block>
                       <v-btn block color="primary" class="text-caption text-sm-button font-weight-medium" @click="signUp">SignUp</v-btn>
                     </v-card-actions>
                      <v-divider></v-divider>
                      <v-card-actions block>
                       <v-btn block color="primary" class="text-caption text-sm-button font-weight-medium" @click="googleLogin"><v-icon>mdi-google</v-icon> &nbsp; Login with Google</v-btn>
                     </v-card-actions>
                  </v-card>
                  <v-snackbar
                     :timeout="4000"
                     v-model="snackbar"
                     absolute
                     bottom
                     center
                     >
                     {{ snackbarText }}
                  </v-snackbar>
               </v-col>
            </v-row>
         </v-container>
</template>

<script>
export default {
   layout: 'signin',
   data() {
      return {
         snackbar: false,
         snackbarText: 'No error message',
         auth: {
            email : '',
            password : ''
         }
      }
   },
   methods: {
      async login () {
         let that = this
         

         // await this.$auth.login({
			// 		email: this.auth.email,
			// 		password: this.auth.password,
			// 	})
				// .then((data) => {
				// 	// if (error) {
				// 	// 	that.snackbarText = error.message;
            //    //    // console.log('error',error.message);
            //    //    that.snackbar = true;
				// 	// } else {
				// 	// 	that.snackbarText = "Login Success!";
            //    //    that.snackbar = true;
            //    //    $nuxt.$router.push('/?login=true');
				// 	// }
            //    console.log(data);
				// })

            try {
               await this.$auth.login({
                  email: this.auth.email,
                  password: this.auth.password,
               });
            } catch (error) {
               this.snackbarText = '';
               if (error.message === 'Authentication Failure') {
                  error.data.forEach((err) => {
                  this.snackbarText += err.message;
                  });
                  that.snackbar = true;
               }
            }

         },
         signUp () {
         let that = this
         
         if(this.auth.email.includes('nextbits') ){
         this.$supabase.auth
				.signUp({
					email: this.auth.email,
					password: this.auth.password,
				})
				.then(({ error, data }) => {
					if (error) {
						that.snackbarText = error.message;
                  // console.log('error',error.message);
                  that.snackbar = true;
					} else {
						that.snackbarText = "verify link on your email";
                  that.snackbar = true;
					}
				})
         }else{
            that.snackbarText = "Email Id Not Valid";
            that.snackbar = true;
         }

         },
      async googleLogin () {
         let that = this
         // const provider = new $nuxt.$fireModule.auth.GoogleAuthProvider()
         // this.$fire.auth.signInWithPopup(provider)
         // .then((result) => {

         //    const user = result.user.multiFactor.user.providerData[0].email;
         //    console.log(user);

         //    if(user.includes('nextbits')) {
         //       that.snackbarText = "Login Success!"
         //       that.snackbar = true
         //       $nuxt.$router.push('/?login=true')
         //    } else {
         //       that.snackbarText = "Email Id Not Valid"
         //       that.snackbar = true
         //       $nuxt.$fire.auth.signOut()
         //    }
         // })
         // .catch(function (error){
         //    that.snackbarText = error.message
         //    that.snackbar = true
         // })

         await this.$supabase.auth.signIn({
            provider: 'google',
         }, {
  redirectTo: '/'
}
         )
         // .then(({ error, data ,user }) => {
			// 		if (error) {
			// 			that.snackbarText = error.message;
         //          // console.log('error',error.message);
         //          that.snackbar = true;
			// 		} else {
			// 			that.snackbarText = "Login Success!";
         //          that.snackbar = true;
         //          location.href = "/?login=true";
			// 		}
			// 	})

         // const { user, session, error } = await supabase.auth.signIn({
         //    provider: 'google',
         // })
      }
   },
   beforeMount() {
      
      if(this.$route.query.logout){
         const query = Object.assign({}, this.$route.query);
         delete query.logout;
         this.$router.replace({ query });
         this.snackbarText = "Logout Success!";
         this.snackbar = true;
      }
      setTimeout(function(){
      console.log($nuxt.$supabase.auth.user());
         if ($nuxt.$supabase.auth.user() != null) {
            if($nuxt.$supabase.auth.user().email.includes('nextbits') ){
            $nuxt.$router.push('/?login=true')
            }else{
               $nuxt.$router.push('/auth/signout');
            }
          }
      },2000)
   }
};
</script>
