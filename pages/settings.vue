<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-toolbar-title class="d-flex align-center text-subtitle-1 text-sm-h6 font-weight-regular">
                <v-icon class="mr-2">
                  mdi-folder-multiple
                </v-icon>
                Projects
              </v-toolbar-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <Projects/>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-toolbar-title class="d-flex align-center text-subtitle-1 text-sm-h6 font-weight-regular">
                <v-icon class="mr-2">
                  mdi-briefcase
                </v-icon>
                Departments
              </v-toolbar-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <Departments/>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-toolbar-title class="d-flex align-center text-subtitle-1 text-sm-h6 font-weight-regular">
                <v-icon class="mr-2">
                  mdi-account-group
                </v-icon>
                Team
              </v-toolbar-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <Team/>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
<style>
@media (max-width:600px) {
  .v-data-table__empty-wrapper td {
    display: inline;
  }
  .v-label, .v-input, .v-list-item .v-list-item__title {
    font-size: 14px;
  }
}
</style>