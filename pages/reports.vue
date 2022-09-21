<template>
  <div>
    <v-row>
      <v-col cols="12">
        
        <template>
          <v-data-table
            :headers="headers"
            :items="projects"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="id"
            show-expand
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat >
                
                <v-toolbar-title>Project Report</v-toolbar-title>
                <v-spacer></v-spacer>


                <template>
                  <v-row justify="end">
                    
                    <v-col cols="auto">
                      <v-dialog
                        transition="dialog-top-transition"
                        max-width="max-content"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                          >Date Filter</v-btn>
                        </template>
                        <template v-slot:default="dialog">
                          <v-card>
                            
                            <v-card-text>
                              <template>
                                <v-row justify="space-around">
                                  <v-date-picker
                                    v-model="date1"
                                    :show-current="true"
                                  ></v-date-picker>
                                  <v-date-picker
                                    v-model="date2"
                                    :show-current="true"
                                  ></v-date-picker>
                                </v-row>
                              </template>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                              <v-btn
                                text
                                @click="dialog.value = false;getTasks()"
                              >Apply</v-btn>
                              <v-btn
                                text
                                @click="dialog.value = false"
                              >Close</v-btn>
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </template>
      
                
              </v-toolbar>
              </template>
              <template v-slot:expanded-item="{ headers, item }" > 
                <td :colspan="headers.length" class="px-0">
                  <v-list class="py-0 teb-contents" one-line v-for="(item, index) in item.tasks"  :key="index">
                        <v-divider></v-divider>
                        <v-list-item  :key="item.project" >
                          <v-list-item-content  class="py-0">
                            <v-container  class="py-0">
                              <v-row no-gutters align="center">
                                <v-col
                                  :cols="10"
                                >
                                  <v-list-item-title class="text-subtitle-2 text-sm-subtitle-1 font-weight-regular">
                                  
                                    <span class="text-caption text-sm-subtitle-2 font-weight-regular">{{item.department}}</span>
                                  </v-list-item-title>
                                  <!-- <v-list-item-subtitle class="text-caption text-sm-subtitle-2 font-weight-regular">{{item.notes}}</v-list-item-subtitle> -->

                                  <!-- <v-list-item class="px-0">
                                    <v-list-item-avatar color="grey darken-3">
                                      <v-img
                                        class="elevation-6"
                                        alt=""
                                        :src="getUser(item.userId).image"
                                      ></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                      <v-list-item-title>{{getUser(item.userId).mname}}</v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item> -->
                                </v-col>
                                <v-col
                                  :cols="2"
                                  class="text-right text-subtitle-2 text-sm-subtitle-1 font-weight-regular"
                                >
                                {{item.hours}} 
                                </v-col>
                                
                              </v-row>
                            </v-container>

                            
                          </v-list-item-content>
                        </v-list-item>
                    
                    </v-list>
              </td>
            </template>
          </v-data-table>
        </template>
      </v-col>
    </v-row>
  </div>
</template>
<style>
.v-data-table-header__icon {
  opacity: 1;
}
@media (max-width:600px) {
  .v-data-table__empty-wrapper td {
    display: inline;
  }
  .v-label, .v-input, .v-list-item .v-list-item__title {
    font-size: 14px;
  }
}
</style>



<script>
  const axios = require('axios');
  export default {
    data () {
      return {
        projects: [],
        tasks: [],
        users: [],
        dateUnformated : new Date().toString(),
        panel: [0, 1],
        headers: [
          
          { text: 'Project', value: 'pname', align: 'start' },
          { text: 'Hours',
            value: 'totalHours',
            align: 'right'
          },
          { text: '', value: 'data-table-expand' },
        ],
        expanded: [],
        singleExpand: false,
        date1: new Date(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).setDate(1)).toISOString().substr(0, 10),
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        
      }
    },
    methods: {

      getTasks(){
      let that = this;
      
      let start = new Date((new Date(this.date1).getTime()) + (new Date(this.date1).getTimezoneOffset()) * 60000).getTime(),
      end = new Date((new Date(this.date2).getTime()) + (new Date(this.date2).getTimezoneOffset()) * 60000).getTime();


      
      let data = JSON.stringify({
        query: `query {
        timesheet(filter: { _and: [{dateTime: { _lte: ${end} } }
          ,{
              dateTime: { _gte: ${start} } 
          }]})  {
          id
          date
          dateTime 
          department
          project
          userId
          hours
          notes
          user_created{
              id
              first_name
              last_name
          }
          user_updated{
              id
              first_name
              last_name
          }
          status
        }
      }`,
        variables: {}
      });

      let token = this.$cookies.get('directus_access_token')

      let config = {
        method: 'post',
        url: `${process.env.DIRECTUS_URL}/graphql`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };
      that.tasks = [];     
      axios(config)
      .then(function ({data}) {
        if(data.data.timesheet.length > 0) {
          try {
              for (const doc of data.data.timesheet) {
                
                that.tasks.push(doc);
              }
              console.log(that.tasks);
              that.setProjects();
            } catch (err) {}
        }
        else{
          console.log("no task");
          that.setProjects();
        }
      })
      .catch(function (error) {
        console.log(error);
      });

      // $nuxt.$supabase.from('tasks').select('*').gte('dateTime', start).lte('dateTime', end).then(function ({data , error}) {
      // that.tasks = [];     

      // if(error){
      //   console.log(error)
      // }
      // else if(data.length > 0) {
      //   try {
      //       for (const doc of data) {
              
      //         that.tasks.push(doc);
      //       }
      //       console.log(that.tasks);
      //       that.setProjects();
            
      //     } catch (err) {}

      // }
      // else{
      //   console.log("no task");
      //   that.setProjects();
      // }
      // })
      
    },
    timestrToSec(timestr) {
      var parts = timestr.split(":");
      return (parts[0] * 3600) +
            (parts[1] * 60) 
    },
    pad(num) {
      if(num < 10) {
        return "0" + num;
      } else {
        return "" + num;
      }
    },
    formatTime(seconds) {
      return [this.pad(Math.floor(seconds/3600)),
              this.pad(Math.floor(seconds/60)%60)
              ].join(":");
    },
    setProjects(){
      let that = this;

      let token = this.$cookies.get('directus_access_token')
        let data = JSON.stringify({
          query: `query {
            project {
              id
              pcode
              pname
            }
          }`,
          variables: {}
        });

        let config = {
          method: 'post',
          url: `${process.env.DIRECTUS_URL}/graphql`,
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function ({data}) {
          that.projects = [];
          if(data.data.project.length > 0) {
            try {
              for (const doc of data.data.project) {
                
                let pname = doc.pcode +' - '+ doc.pname;
                let tasks= that.tasks.filter(task => (task.project == pname)),
                totalHours="00:00";
                console.log(doc,tasks,pname)
                for(const task of tasks){
                  totalHours = that.formatTime(that.timestrToSec(totalHours) + that.timestrToSec(task.hours));
                }
                
                that.projects.push(
                {
                  id: doc.id,
                  pcode : doc.pcode,
                  pname : doc.pname,
                  tasks : tasks,
                  totalHours : totalHours
                }
                )
              }
              
            } catch (err) {}
          }
          // console.log(that.projects);
        })
        .catch(function (error) {
          console.log(error);
        });

      // $nuxt.$supabase.from('projects').select('*').then(function ({data , error}) {
              
      //     that.projects = [];
      //     if(error){
      //       console.log(error)
      //     }
      //     else if(data.length > 0) {
      //       try {
      //         for (const doc of data) {
      //           let pname = doc.pcode +' - '+ doc.pname;
      //           let tasks= that.tasks.filter(task => (task.project == pname)),
      //           totalHours="00:00";
      //           console.log(doc,tasks,pname)
      //           for(const task of tasks){
      //             totalHours = that.formatTime(that.timestrToSec(totalHours) + that.timestrToSec(task.hours));
      //           }
                
      //           that.projects.push(
      //           {
      //             id: doc.id,
      //             pcode : doc.pcode,
      //             pname : doc.pname,
      //             tasks : tasks,
      //             totalHours : totalHours
      //           }
      //           )
        
      //         }
      //         console.log(that.projects);
              
      //       } catch (err) {}
      //     }
      //     // else{
            
      //     // }
      //   })
    },
    getUserList(){
      let that = this;
      let token = this.$cookies.get('directus_access_token')
      let data = JSON.stringify({
        query: `query {
        users {
          id
          first_name
          last_name
          email
        }
      }`,
        variables: {}
      });

      let config = {
        method: 'post',
        url: `${process.env.DIRECTUS_URL}/graphql/system`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then(function ({data}) {
        that.users = [];
        if(data.data.users.length > 0) {
          try {
            for (const doc of data.data.users) {
              
               that.users.push(doc);
            }
            
          } catch (err) {}
        }
        // console.log(that.team);
      })
      .catch(function (error) {
        console.log(error);
      });


      // $nuxt.$supabase.from('team').select('*').then(function ({data , error}) {
              
      //     that.users = [];
      //     if(error){
      //       console.log(error)
      //     }
      //     else if(data.length > 0) {
      //       try {
      //         for (const doc of data) {
                
      //           that.users.push(doc);
      //         }
              
      //       } catch (err) {}
      //     }
      //     // else{
            
      //     // }
      //   })
    },
    getUser(id){
      let user = this.users.filter((usr)=>(usr.userId == id ))[0];
      return user;
    }

    },
    beforeMount () {
      this.getUserList();
      this.getTasks();
    }
  }
</script>