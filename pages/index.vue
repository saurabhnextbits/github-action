<template>
  <v-row>
    <v-col cols="12" md="8" class="time-block">
      <v-card >
      <v-sheet>
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="grey--text mr-4 d-none d-sm-block"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            @click="prev"
          >
            <v-icon  class="grey--text">
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            class="ml-2"
            @click="next"
          >
            <v-icon  class="grey--text">
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title class="ml-4 grey--text text-subtitle-1 text-sm-h6 font-weight-regular" >
            {{ ($vuetify.breakpoint.xsOnly)?(new Date(this.dateUnformated).toLocaleDateString('en-us', { weekday:"short",  month:"short", day:"numeric"})):(new Date(this.dateUnformated).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})) }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          
          
            <!-- <div style="position : relative">
              <v-btn
                icon
                color="grey"
                @click="calendarShow = !calendarShow"
                
              >
                <v-icon>mdi-calendar-edit</v-icon>
              </v-btn>
              <v-date-picker
              :show-current="true"
              :value="(new Date(this.dateUnformated.getTime() - this.dateUnformated.getTimezoneOffset() * 60000).toISOString().substr(0, 10))"
              class="toolbar__date-picker"
              no-title
              v-if="calendarShow"
              @input="setDate"
              elevation="2"
              color="primary" 
            ></v-date-picker>
            </div> -->
            <div class="time-block-right d-flex justify-end">
              <v-menu
                ref="calendarShow"
                v-model="calendarShow"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
                bottom
                left
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="grey"
                    v-on="on"
                        
                  >
                  <v-icon>mdi-calendar-edit</v-icon>
                      </v-btn>
                </template>
                <v-date-picker
                  :value="(new Date((new Date(this.dateUnformated).getTime()) - (new Date(this.dateUnformated).getTimezoneOffset()) * 60000).toISOString().substr(0, 10))"
                  no-title
                  scrollable
                  color="primary"
                  @input="setDate"
                >
                  <!-- <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    OK
                  </v-btn> -->
                </v-date-picker>
              </v-menu>
            </div>
            
            
          
        </v-toolbar>
      </v-sheet>
        <v-divider></v-divider>
        <v-tabs v-model="tab" @change="tabChange" class="taskTabs" hide-slider>
          <v-tab v-for="item in tabItems" class="flex-column justify-center align-center " :key="item.id" :href="'#'+item.id" >
            {{ ($vuetify.breakpoint.xsOnly && item.tab != 'Total')?item.tab.charAt(0):item.tab }}
            
            <span class="grey--text text--lighten-1">{{item.hours}}</span>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" hide-slider>
          <v-tab-item v-for="itemTitle in tabItems" :key="itemTitle.id" :value="itemTitle.id" >
          <v-divider></v-divider>
          <v-list three-line class="d-flex align-center" v-if="itemTitle.tasks.length == 0" height="200">
            <v-list-item>
              <v-list-item-content class="font-weight-bold grey--text text--disabled text-center justify-center text-subtitle-2 text-sm-subtitle-1">

                "If You Can't Measure It, You Can't Improve It" <v-spacer></v-spacer>
                        ....Time

              </v-list-item-content>
            </v-list-item>
          
          </v-list>
            <v-list class="py-0 teb-contents" v-else  three-line v-for="(item, index) in itemTitle.tasks"  :key="index">
              <v-divider></v-divider>
              <v-list-item  :key="item.project">
                <v-list-item-content>
                  <v-container class="">
                    <v-row no-gutters align="center">
                      <v-col
                        :cols="8"
                      >
                        <v-list-item-title class="text-subtitle-2 text-sm-subtitle-1 font-weight-regular">
                          {{item.project}} &mdash;
                          <span class="text-caption text-sm-subtitle-2 font-weight-regular">{{item.department}}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-caption text-sm-subtitle-2 font-weight-regular">{{item.notes}}</v-list-item-subtitle>
                      </v-col>
                      <v-col
                        :cols="2"
                        class="text-right text-subtitle-2 text-sm-subtitle-1 font-weight-regular"
                      >
                      {{item.hours}} 
                      </v-col>
                      <v-col :cols="2"
                             class="d-flex justify-end">

                        <v-icon class="grey--text mr-2"
                                @click="dialogUpdate(item.id)">
                          mdi-pencil
                        </v-icon>
                        <!--
    <v-icon
    class="grey--text d-none d-sm-inline-block"
    @click="deleteItem(item.id)">
    mdi-delete
  </v-icon>
  -->
                      </v-col>
                    </v-row>
                  </v-container>

                  
                </v-list-item-content>
              </v-list-item>
             
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
      
      <v-dialog v-model="dialog" scrollable max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" class="mx-2 add-btn" color="primary" fab large>
              <v-icon>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <v-form ref="form" v-model="valid">
            <v-card>
              <v-card-title class="text-subtitle-1 text-sm-h6 font-weight-bold">New time entry for {{new Date((new Date(this.date).getTime()) + (new Date(this.date).getTimezoneOffset()) * 60000).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}}</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                
                <v-autocomplete :items="projects"
                                autofocus
                                :item-text="projects => projects.pcode +' - '+ projects.pname"
                                label="Project"
                                filled
                                v-model="task.project"
                                :rules="[(v) => !!v || 'Project / Task is required']"
                                required
                                clearable
                                dense></v-autocomplete>

                <v-autocomplete :items="departments"
                                item-text="dname"
                                label="Department"
                                filled
                                v-model="task.department"
                                :rules="[(v) => !!v || 'Department is required']"
                                required
                                clearable
                                dense
                                ></v-autocomplete>
                <v-text-field label="Time"
                              placeholder="00:00"
                              filled
                              v-model="task.hours"
                              @focusout="timeConvert()"
                              id="taskTime"
                              :rules="[(v) => !!v || 'Time is required']"
                              required
                              clearable
                              dense
                              ></v-text-field>
                
                <v-textarea label="Notes"
                            auto-grow
                            rows="3"
                            row-height="20"
                            filled
                            v-model="task.notes"
                            clearable
                            dense></v-textarea>

                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                  bottom
                  color="primary"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Date"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      filled
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                    color="primary"
                    @input="$refs.menu.save(date)"
                  >
                    <!-- <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="menu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(date)"
                    >
                      OK
                    </v-btn> -->
                  </v-date-picker>
                </v-menu>
                      
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions v-if="!edit"> 
                <v-btn block large color="primary" class="text-caption text-sm-button font-weight-medium" @click="dialogSubmit">
                  Save
                </v-btn>
              </v-card-actions>
              <v-card-actions  v-if="edit">
                <v-btn block large color="primary" class="text-caption text-sm-button font-weight-medium" @click="updateTask(task.id)">
                  Update
                </v-btn>
              </v-card-actions>
              <v-card-actions  v-if="edit">
                <v-btn block large color="error" class="text-caption text-sm-button font-weight-medium" @click="deleteItem(task.id)">
                  Delete
                </v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn block @click="dialogClose" class="text-caption text-sm-button font-weight-medium">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="closeDelete">Cancel</v-btn>
              <v-btn color="primary" @click="deleteTask">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
      </v-dialog>
      
      
    </v-col>
    <v-snackbar
          :timeout="4000"
          v-model="snackbar"
          absolute
          bottom
          center
          >
          {{ snackbarText }}
    </v-snackbar>
  </v-row>
</template>



<style scoped>
  .v-dialog > .v-card > .v-card__text{
    padding-top: 20px;
  }

  .time-block {
    display: inline-block;
    /* max-width: 100%; */
    margin: 0 auto;
    position: relative;
  }
  .time-block-right {
    width: 180px;
  }

  .time-block .add-btn {
    position: fixed;
    top: unset;
    right: 10px;
    bottom: 50px;
  }
  .time-block .teb-contents {
    margin-top: -1px;
  }
  .taskTabs .v-tab {
    min-width: 12.5%;
    text-transform:none;
  }
  .taskTabs .v-tab--active.v-tab:not(:focus)::before {
    opacity: 0.12;
  }
  .taskTabs .v-tab:last-child {
    pointer-events: none;
  }
  .taskTabs .v-tab:last-child::before {
    opacity: 0.12;
  }
  @media (max-width:767px) {
    .taskTabs .v-tab {
      padding: 0 10px;
    }
    .time-block-right {
      width: auto;
    }
  }
  @media (max-width:600px) {
    .taskTabs .v-tab {
      padding: 4px;
      font-size: 12px;
      min-width: 14.28%;
    }
    
    .taskTabs .v-tab:last-child {
      flex-direction: row !important;
      flex: 0 0 100%;
      max-width: 100%;
      padding: 10px;
      font-size: 12px;
    }
    .taskTabs .v-tab span {
      font-size: 9px;
    }
    .taskTabs .v-tab:last-child span {
      font-size: 12px;
    }
     
  }
   .v-list-item__subtitle {
    -webkit-line-clamp: unset !important;
  }
  .v-application--is-ltr .v-divider--inset:not(.v-divider--vertical) {
    max-width: 100%;
    margin-left: 0%;
  }

  .v-dialog .theme--dark.v-card{
    background-color: #121212;
  }
  
  /* header{
    z-index: 1;
    overflow-y: visible;
  } */

  


  </style>

  <style>
  .taskTabs .v-slide-group__content {
    justify-content: space-between;
  }
  
  @media (max-width:767px) {
    .taskTabs .v-tabs-slider-wrapper ,.taskTabs .v-slide-group__prev, .taskTabs .v-slide-group__next {
      display: none !important;
    }
    input#taskTime::-webkit-calendar-picker-indicator {
      display: none;
    }
  }
  @media (max-width:600px) {
    .taskTabs .v-item-group {
      height: auto !important;
    }
    .taskTabs .v-slide-group__content {
      flex-wrap: wrap;
      flex: 0 0 100%;
    }
    .v-label, .v-input, .v-list-item .v-list-item__title {
      font-size: 14px;
    }
  }
</style>

<script>
  import { v4 as uuidv4 } from 'uuid';
  var moment = require('moment');
  const axios = require('axios');

export default {

  data: () => ({
    dialogm1: '',
    dialog: false,
    absolute: true,
    opacity: 1,
    overlay: false,
    drawer: null,
    tab: 0,
    tabItems: [],
    tabContentItems: [],
    links: [
      'Time',
      'Projects',
      'Team',
      'Reports',
    ],
    projects: [],
    departments: [],
    dateUnformated : new Date().toString(),
    dateShow : new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}),
    calendarShow : false,
    task: {
      id: Date.now() + parseInt(Math.random()*100),
      userId:'',
      date: new Date(),
      dateTime: new Date().getTime(),
      project:'',
      department:'',
      hours:'',
      notes:'',
      status:'active'
    },
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    edit: false,
    deleteId:'',
    dialogDelete :false,
    valid:false,
    snackbar: false,
    snackbarText: '',
    start:"",
    end:"",
    team:''
  }),

  created() {
    this.projectList();
    this.departmentList();
  },
  // middleware: 'authenticated',
  methods: {
    setDate (x) {
      // this.dateUnformated = moment(x).format('MMMM Do YYYY, h:mm:ss a');
      // console.log("moment" + this.dateUnformated);
      this.dateUnformated = new Date((new Date(x).getTime()) + (new Date(x).getTimezoneOffset()) * 60000);
      // console.log("date" + this.dateUnformated);
      // this.dateShow = new Date(x).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
      this.calendarShow = !this.calendarShow
    },

    setToday () {
      this.dateUnformated = new Date().toString();
      // this.dateShow = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
    },
    prev () {
      let nextDate = new Date(this.dateUnformated);
      nextDate.setDate(nextDate.getDate() - 1);
      //console.log(nextDate);
      
      this.dateUnformated = nextDate.toString();
      // this.dateShow = nextDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    },
    next () {
      let nextDate = new Date(this.dateUnformated);
      nextDate.setDate(nextDate.getDate() + 1);
      //console.log(nextDate);
      this.dateUnformated = new Date(nextDate).toString();
      // this.dateShow = nextDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    },
    timestrToSec(timestr) {
      // console.log(timestr)
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
      // console.log(seconds);
      return [this.pad(Math.floor(seconds/3600)),
              this.pad(Math.floor(seconds/60)%60)
              ].join(":");
    },
    hourCalculator(tabitem){
      // console.log(tabitem);
      for(let i=0;i< this.tabContentItems.length; i++){
        // console.log(this.tabContentItems[i]);
        if(this.tabContentItems[i].day == tabitem.tab || tabitem.tab == 'Total'){
          tabitem.hours = this.formatTime(this.timestrToSec(tabitem.hours) + this.timestrToSec(this.tabContentItems[i].hours));
        }
      }
      this.tabItems[tabitem.id].hours = tabitem.hours;
      return tabitem.hours
    
    },

    
    setTabContentItems(){
      let that = this;
      let currDate = new Date(this.dateUnformated);
      // console.log(currDate.getTime(),moment(currDate).weekday(0).get('date'));
      let startDate = moment(currDate).weekday(0);
      currDate.setDate(startDate.get('date'));
      currDate.setMonth(startDate.get('month'));
      currDate.setFullYear(startDate.get('year'));

      // currDate.setDate(currDate.getDate() - currDate.getDay() +1);
      currDate.setHours("00");
      currDate.setMinutes("00");
      currDate.setSeconds("00");
      this.start = parseFloat(new Date((currDate.getTime()) + currDate.getTimezoneOffset() * 60000).getTime());
      console.log(currDate);
      currDate.setHours("23");
      currDate.setMinutes("59");
      currDate.setSeconds("59");
      currDate.setDate(currDate.getDate() +6);
      console.log(currDate);
      this.end = parseFloat(new Date((currDate.getTime()) + currDate.getTimezoneOffset() * 60000).getTime());
      console.log(this.start,this.end);

     

      
      let data = JSON.stringify({
        query: `query {
        timesheet(filter: { _and: [{dateTime: { _lte: ${this.end} } }
          ,{
              dateTime: { _gte: ${this.start} } 
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
        url: `https://5mee2e5z.directus.app/graphql`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then(function ({data}) {
        if(data.data.timesheet.length > 0) {
          try {
              that.tabContentItems = [];
              for (const doc of data.data.timesheet) {
                
                that.tabContentItems.push(doc);
              }
              // console.log(that.tabContentItems);
              that.setTabItems();
            } catch (err) {}
        }
        else{
          that.setTabItems();
        }
        console.log(that.tabContentItems);
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    setTabItems(){
      let curr = new Date(this.dateUnformated);
      let currTime = parseFloat(new Date((curr.getTime()) + curr.getTimezoneOffset() * 60000).getTime());
      // console.log(curr,currTime);
      if(this.start<= currTime && currTime <= this.end){
      let currId = '',
      tabItems = [],
      totalItem = {
        id:"w7"+Math.floor(Math.random() * 1000),
        tab:"Total",
        tasks:[],
        hours:"00:00"
        };
      
      let tabDate = new Date(this.start);
      tabDate.setDate(tabDate.getDate());
      tabDate.setHours("00");
      tabDate.setMinutes("00");
      tabDate.setSeconds("00");

      for (let i = 0; i < 7; i++) {
        let item = {};
        item.id = "w"+i+Math.floor(Math.random() * 1000);
        // console.log(tabDate.getDate());
        let first =(i==0 && tabDate.toLocaleDateString('en-us', { weekday:"long" }) == 'Sunday'? tabDate.getDate(): tabDate.getDate()+1) ;
        console.log(first);
        let day = new Date(tabDate.setDate(first)).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
        if((tabDate.getDate()) == (new Date(this.dateUnformated).getDate())){
          currId = item.id;
          // console.log(currId);
        }
        item.tab = new Date(day).toLocaleDateString('en-us', { weekday:"short"});
        item.date= new Date(day).toString();
        // console.log(i,"-----",item.date)
        item.tasks = [];
        item.hours = "00:00";
        for(let j=0;j<this.tabContentItems.length;j++){
          // console.log(this.tabContentItems[j].date == day);
          if(this.tabContentItems[j].date == day){
            item.tasks.push(this.tabContentItems[j]);
            item.hours = this.formatTime(this.timestrToSec(item.hours) + this.timestrToSec(this.tabContentItems[j].hours));
            totalItem.tasks.push(this.tabContentItems[j]);
            totalItem.hours = this.formatTime(this.timestrToSec(totalItem.hours) + this.timestrToSec(this.tabContentItems[j].hours));
            // console.log(totalItem.hours);
          }
        }
        // console.log(item);

       
        tabItems.push(item);
      }
      // console.log(totalItem);
      tabItems.push(totalItem);
      this.tabItems = tabItems;
      this.tab = currId;
      // console.log("tab ----- ",this.tabItems,this.tab);
    }
    else{
      // console.log("else part");
      this.setTabContentItems();
    }
    },
    
    
    dialogUpdate(id){
      let tasks = this.tabContentItems.filter((tsk) => (tsk.id == id));
      this.task = tasks[0];
      // console.log(tasks);
      this.edit = true;
      this.dialog = true;
    },
    dialogClose(){
      this.setTabContentItems();
      this.dialog = false;
      this.edit = false;
      this.date = new Date((new Date(this.dateUnformated).getTime()) - (new Date(this.dateUnformated).getTimezoneOffset()) * 60000).toISOString().substr(0, 10);
      this.task.id='';
      this.task.date = new Date((new Date(this.date).getTime()) + (new Date(this.date).getTimezoneOffset()) * 60000).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
      this.task.dateTime = new Date((new Date(this.date).getTime()) + (new Date(this.date).getTimezoneOffset()) * 60000).getTime();
      this.task.project='';
      this.task.department='';
      this.task.hours='';
      this.task.notes=''
    
      console.log(this.task);
            
    },
    dialogSubmit(){
      let that = this
      if (this.$refs.form.validate()) {
        this.task.id = Date.now() + parseInt(Math.random()*100);
        this.task.userId = this.$auth.user.id;
        this.task.date = String(new Date((new Date(this.date).getTime()) + (new Date(this.date).getTimezoneOffset()) * 60000).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}));
        this.task.dateTime = parseFloat(new Date((new Date(this.date).getTime()) + (new Date(this.date).getTimezoneOffset()) * 60000).getTime());
        this.status = "published";
        
        // console.log(this.task);

        let data = JSON.stringify({
        query: `mutation {
          create_timesheet_item(data: {
            id: "${this.task.id}",
            date: "${this.task.date}",
            dateTime: ${this.task.dateTime},
            project: "${this.task.project}",
            department: "${this.task.department}",
            hours: "${this.task.hours}",
            notes: "${this.task.notes}",
            userId: "${this.task.userId}"
            status: "${this.task.status}"
          })
          {
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
        url: `https://5mee2e5z.directus.app/graphql`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then(function (response) {
        console.log(response);
        // that.$refs.form.reset();
        that.$refs.form.resetValidation();
        that.dateUnformated = new Date((new Date(that.date).getTime()) + (new Date(that.date).getTimezoneOffset()) * 60000);
        that.dialogClose();
      })
      .catch(function (error) {
        console.log(error);
      });



      }



      
    },
    getTask(id){
      
    },
    async updateTask(id){
      if (this.$refs.form.validate()) {
        // let tasks = JSON.parse(localStorage.getItem('tasks'));
        // let index = tasks.findIndex((tsk) => (tsk.id == id));
        // this.task.id = id;
        this.task.date = String(new Date((new Date(this.date).getTime()) + (new Date(this.date).getTimezoneOffset()) * 60000).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}));
        this.task.dateTime = parseFloat(new Date((new Date(this.date).getTime()) + (new Date(this.date).getTimezoneOffset()) * 60000).getTime());

        let that = this
        

        
        // console.log(this.task);

        let data = JSON.stringify({
        query: `mutation {
          update_timesheet_item(id:"${this.task.id}" ,data: {
            id:"${this.task.id}"
            date: "${this.task.date}",
            dateTime: ${this.task.dateTime},
            project: "${this.task.project}",
            department: "${this.task.department}",
            hours: "${this.task.hours}",
            notes: "${this.task.notes}",
            userId: "${this.task.userId}"
            status: "${this.task.status}"
          })
          {
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
        url: `https://5mee2e5z.directus.app/graphql`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then(function (response) {
        console.log(response);
        // that.$refs.form.reset();
        that.dateUnformated = new Date((new Date(that.date).getTime()) + (new Date(that.date).getTimezoneOffset()) * 60000);
        that.$refs.form.resetValidation();
        that.dialogClose();
      })
      .catch(function (error) {
        console.log(error);
      });

      }
    },
    async deleteTask(){
      let id = this.deleteId;
      let that = this
        let data = JSON.stringify({
        query: `mutation {
          delete_timesheet_item(id:"${id}")
          {
            id
          }
        }`,
        variables: {}
      });

      let token = this.$cookies.get('directus_access_token')

      let config = {
        method: 'post',
        url: `https://5mee2e5z.directus.app/graphql`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then(function (response) {
        console.log(response);
        // that.$refs.form.reset();
        that.$refs.form.resetValidation();
        that.dialogDelete = false;
        that.dialogClose();
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },
    tabChange (id) {
      // console.log(id);
      let currTab = this.tabItems.filter((tab) => (tab.id == id))[0] ;
      if(currTab.date != null){
        this.dateUnformated = new Date(currTab.date).toString();
        // console.log(currTab,new Date(currTab.date).toString());
      }
    },
    projectList() {
      
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
        url: `https://5mee2e5z.directus.app/graphql`,
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
              
              that.projects.push(doc);
            }
            
          } catch (err) {}
        }
        // console.log(that.projects);
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    departmentList() {
      let that = this;
      let token = this.$cookies.get('directus_access_token')
      let data = JSON.stringify({
        query: `query {
          department {
            id
            dname
          }
        }`,
        variables: {}
      });

      let config = {
        method: 'post',
        url: `https://5mee2e5z.directus.app/graphql`,
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then(function ({data}) {
        that.departments = [];
        if(data.data.department.length > 0) {
          try {
            for (const doc of data.data.department) {
              
              that.departments.push(doc);
            }
            
          } catch (err) {}
        }
        // console.log(that.departments);
      })
      .catch(function (error) {
        console.log(error);
      });
        

    },
    deleteItem(id) {
      this.dialogDelete = true;
      this.deleteId = id;
    },
    closeDelete() {
      this.deleteId = '';
      this.dialogDelete = false
    },
    timeConvert(){ 
      let number = this.task.hours;
      
      if(number.includes(':')){
        // console.log(number);
       this.task.hours = number; 
      }
      else{
        // console.log(number);
        // Check sign of given number
    var sign = (number >= 0) ? 1 : -1;

    // Set positive value of number of sign negative
    number = number * sign;

    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;

    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    var minute = Math.floor(decpart * 60) + '';

    // Add padding if need
    // if (minute.length < 2) {
    // minute = '0' + minute; 
    // }

    // Add Sign in final result
    sign = sign == 1 ? '' : '-';

    // Concate hours and minutes
    this.task.hours = sign + this.pad(hour) + ':' + this.pad(minute);
  
      }
             
    },
    
  },
  watch: {
    dateUnformated: function (val, oldVal) {
      // console.log(val);
      this.setTabItems();
      this.date = new Date((new Date(val).getTime()) - (new Date(val).getTimezoneOffset()) * 60000).toISOString().substr(0, 10);
      // this.dateShow = new Date(val).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
      // console.log(this.date,this.tabItems);
      // console.log("hello",val);

    },
    // date: function (val, oldVal) {
    //   // console.log(val,this.dateUnformated);
    // }
  },
  beforeMount() {
    this.setTabContentItems();
    console.log(this.$auth.user);
    
    
    
    if(this.$route.query.login){
      const query = Object.assign({}, this.$route.query);
      delete query.login;
      this.$router.replace({ query });
      this.snackbarText = "Login Success!";
      this.snackbar = true;
    }
    
    
  },
  
  
}

</script>
