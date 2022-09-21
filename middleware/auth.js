

export default ({app, route, redirect}) => {
	

  if (route.path !== '/auth/signin') {
          //we are on a protected route
          if (!app.$auth.user) {
            return redirect('/auth/signin')
          }
        } else if (route.path === '/auth/signin') {
          
          if(!app.$auth.user) {
            //leave them on the sign in page
          } else {
            return redirect('/')
          }
        }

}
