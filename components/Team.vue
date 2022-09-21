<template>
  <v-data-table
    :headers="headers"
    :items="team"
    sort-by="first_name"
    show-select
    v-model="selected"
    item-key="id"
  >
    <template v-slot:top>
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-dialog v-model="dialog"
                    max-width="500px">
            <!-- <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary"
                    dark
                    class="mb-2 text-caption text-sm-button font-weight-medium"
                    v-bind="attrs"
                    v-on="on">
                Add New Member
              </v-btn>
            </template> -->
            <v-form ref="form" v-model="valid">
              <v-card>
                <v-card-title>
                  <span class="text-h6 text-sm-h5 font-weight-regular">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container class="px-0">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field filled v-model="editedItem.first_name"
                                      label="Member Name" :rules="rules"></v-text-field>
                        <v-text-field filled v-model="editedItem.email"
                                      label="Member Name" :rules="rules"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions v-if="!edit">
                  <v-btn block large class="text-caption text-sm-button font-weight-medium" color="primary"
                        @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
                <v-card-actions class="text-caption text-sm-button font-weight-medium" v-if="edit">
                  <v-btn block large color="primary" @click="updateTask">
                    Update
                  </v-btn>
                </v-card-actions>
                <v-card-actions>
                  <v-btn block class="text-caption text-sm-button font-weight-medium"
                        @click="close">
                    Cancel
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
                <v-btn color="primary" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small
              class="mr-2"
              @click="editItem(item.id)">
        mdi-pencil
      </v-icon>
      <v-icon small
              @click="deleteItem(item.id)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <div class="d-flex align-center justify-center my-16 text-subtitle-2 text-sm-subtitle-1 font-weight-bold">
        No Data Found <br/> Add New Member
      </div>
    </template>
  </v-data-table>
</template>

<script>
  import { v4 as uuidv4 } from 'uuid'
  const axios = require('axios');

  export default {
    data (){
      return {
        singleSelect: false,
        selected: [],
        dialog: false,
        deleteId: '',
        editId: '',
        edit: false,
        dialogDelete: false,
        headers: [
          {
            text: 'First Name',
            align: 'start',
            sortable: false,
            value: 'first_name',
          },
          {
            text: 'Last Name',
            sortable: false,
            value: 'last_name',
          },
          // { text: 'Actions', value: 'actions', sortable: false },
        ],
        team: [],
        editedIndex: -1,
        editedItem: {
          id: '',
          mname: '',
          email: ''
        },
        defaultItem: {
          id: '',
          mname: '',
          email: ''
        },
        rules: [
          value => !!value || 'Required.',
        ],
        valid:false
      }

    },

    computed: {
      formTitle() {
        return this.edit == false ? 'New Member' : 'Edit Member'
      },
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
    },

    created() {
      this.initialize()
    },

    methods: {
      initialize() {
        let that = this;
        const token = this.$cookies.get('directus_access_token')
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
          url: `https://5mee2e5z.directus.app/graphql/system`,
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function ({data}) {
          that.team = [];
          if(data.data.users.length > 0) {
            try {
              for (const doc of data.data.users) {
                
                that.team.push(doc);
              }
              
            } catch (err) {}
          }
          // console.log(that.team);
        })
        .catch(function (error) {
          console.log(error);
        });


      },
      save() {
        if (this.$refs.form.validate()) {
          let that = this;

          // this.editedItem.id = new Date().getTime();
          this.editedItem.id = uuidv4();
          

            $nuxt.$supabase.from('team').insert([this.editedItem]).then(function ({data , error}) {
              
            that.team = [];
            if(error){
              console.log(error)
            }
            else {
              that.close();
              that.initialize(); 
            }
            
          })
        }

      },
      editItem(id) {
        let teamData = this.team.filter((tsk) => (tsk.id == id));
        this.editedItem = teamData[0];
        this.editId = id;
        this.edit = true;
        this.dialog = true;
      },
      async updateTask() {
        if (this.$refs.form.validate()) {
          // let teamData = JSON.parse(localStorage.getItem('teamData'));
          // let index = teamData.findIndex((tsk) => (tsk.id == this.editId));
          this.editedItem.id = this.editId;
          // teamData[index] = this.editedItem;
          // localStorage.setItem('teamData', JSON.stringify(teamData));
          // this.initialize();
          // this.close();
          let that = this
          

          // await $nuxt.$supabase.from('team').update(that.editedItem).eq('id',that.editedItem.id).then(function(d){
          //   console.log(d);
          //   that.close();
          //   that.initialize();

          // }) 
        }
      },

      deleteItem(id) {
        this.dialogDelete = true
        this.deleteId = id;
      },

      async deleteItemConfirm() {
        // let teamData = JSON.parse(localStorage.getItem('teamData'));
        // let index = teamData.findIndex((tsk) => (tsk.id == this.deleteId));
        // teamData.splice(index,1);
        // localStorage.setItem('teamData', JSON.stringify(teamData));
        // // this.teamData.splice(this.editedIndex, 1)
        // this.initialize();
        // this.closeDelete()
        let id = this.deleteId;

        let that = this
      try {
        
        // await $nuxt.$supabase.from('team').delete().eq('id',id).then(function(d){
        //   console.log(d);
        //   that.closeDelete();
        //   that.initialize();
        // }) 


      } catch (error) {
        // $nuxt.$router.push('/')
      }

      },

      close() {
        this.dialog = false
         this.edit = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
    },
  }
</script>