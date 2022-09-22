<template>
  <v-data-table
    :headers="headers"
    :items="projects"
    sort-by="pcode"
    show-select
    v-model="selected"
    item-key="id"
    dance
  >
    <template v-slot:top>
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-dialog v-model="dialog"
                    max-width="500px">
            <template v-if="$auth.user.permission == 'admin' || $auth.user.permission == 'manager'" v-slot:activator="{ on, attrs }">
              <v-btn color="primary"
                    dark
                    class="mb-2 text-caption text-sm-button font-weight-medium"
                    v-bind="attrs"
                    v-on="on">
                Add New Project
              </v-btn>
            </template>
            <v-form ref="form" v-model="valid">
              <v-card>
                <v-card-title>
                  <span class="text-h6 text-sm-h5 font-weight-regular">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container class="px-0">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field filled v-model="editedItem.pcode"
                                      label="Project Code" :rules="rules"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field filled v-model="editedItem.pname"
                                      label="Project Name" :rules="rules"></v-text-field>
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
                <v-card-actions v-if="edit">
                  <v-btn block large class="text-caption text-sm-button font-weight-medium" color="primary" @click="updateTask">
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
        No Data Found <br/> Add New Project
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
            text: 'Project Code',
            align: 'start',
            sortable: false,
            value: 'pcode',
          },
          { text: 'Project Name', value: 'pname' }
        ],
        projects: [],
        editedIndex: -1,
        editedItem: {
          id: '',
          pcode: '',
          pname: '',
        },
        defaultItem: {
          id: '',
          pcode: '',
          pname: '',
        },
        rules: [
          value => !!value || 'Required.',
        ],
        valid:false
      }

    },

    computed: {
      formTitle() {
        return this.edit == false ? 'New Project' : 'Edit Project'
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
      if (this.$auth.user.permission == "admin" || this.$auth.user.permission == "manager") {
        this.headers= [
          {
            text: 'Project Code',
            align: 'start',
            sortable: false,
            value: 'pcode',
          },
          { text: 'Project Name', value: 'pname' },
          { text: 'Actions', value: 'actions', sortable: false }
        ];
      } 
      this.initialize()
    },

    methods: {
      initialize() {

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
      save() {
        if (this.$refs.form.validate()) {
          let that = this;
          this.editedItem.id = Date.now() + parseInt(Math.random()*100);
          let token = this.$cookies.get('directus_access_token')
          let data = JSON.stringify({
            query: `mutation {
              create_project_item (data:{id:"${this.editedItem.id}",pname:"${this.editedItem.pname}",pcode:"${this.editedItem.pcode}",status:"active"}) {
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
          .then(function (response) {
            console.log(response);
            that.close();
            that.initialize();
          })
          .catch(function (error) {
            console.log(error);
          });

          // $nuxt.$supabase.from('projects').insert([this.editedItem]).then(function ({data , error}) {
              
          //   that.projects = [];
          //   if(error){
          //     console.log(error)
          //   }
          //   else {
          //     that.close();
          //     that.initialize(); 
          //   }
            
          // })
        }
      },
      editItem(id) {
        let projectData = this.projects.filter((tsk) => (tsk.id == id));
        this.editedItem = projectData[0];
        this.editId = id;
        this.edit = true;
        this.dialog = true;
      },
      async updateTask() {
        if (this.$refs.form.validate()) {
          this.editedItem.id = this.editId;
          let that = this;
          let token = this.$cookies.get('directus_access_token')
          let data = JSON.stringify({
            query: `mutation {
              update_project_item (id:${this.editedItem.id},data:{id:${this.editedItem.id},pname:"${this.editedItem.pname}",pcode:"${this.editedItem.pcode}",status:"active"}) {
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
          .then(function (response) {
            console.log(response);
            that.close();
            that.initialize();
          })
          .catch(function (error) {
            console.log(error);
          });

          // await $nuxt.$supabase.from('projects').update(that.editedItem).eq('id',that.editedItem.id).then(function(d){
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
        let id = this.deleteId;

        let that = this;
        let token = this.$cookies.get('directus_access_token')
          let data = JSON.stringify({
            query: `mutation {
              delete_project_item (id:${id}) {
                id
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
          .then(function (response) {
            console.log(response);
            that.closeDelete();
            that.initialize();
          })
          .catch(function (error) {
            console.log(error);
          });

       
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