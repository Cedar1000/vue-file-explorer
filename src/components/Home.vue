<template>
  <div>
    <div class="layout">
      <div class="structure">
        <v-treeview
          v-model="tree"
          :open="initiallyOpen"
          :items="items"
          activatable
          item-key="name"
          open-on-click
        >
          <template v-slot:label="{ item, open }">
            <div class="item-wrapper">
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>

              <v-icon v-if="item.file">
                {{ files[item.file] }}
              </v-icon>

              <div class="action">
                <a @click="updateShowcase(item)">{{ item.name }}</a>
              </div>
            </div>
          </template>
        </v-treeview>
      </div>

      <div class="showcase">
        <v-card class="mx-auto list" tile>
          <v-dialog
            v-model="showDialog"
            transition="dialog-top-transition"
            max-width="600"
          >
            <template v-slot:activator="{ on, attrs }">
              <div class="buttons">
                <v-btn
                  class="add-btn"
                  @click="type = 'file'"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  ><span class="btn-wrapper">
                    <i class="fas fa-plus"></i> <span>Add File</span>
                    <i class="far fa-file-alt"></i> </span
                ></v-btn>

                <v-btn
                  class="add-btn"
                  color="primary"
                  @click="type = 'folder'"
                  v-bind="attrs"
                  v-on="on"
                  ><span class="btn-wrapper"
                    ><i class="fas fa-plus"></i> <span>Add Folder</span>
                    <i class="fas fa-folder"></i></span
                ></v-btn>
              </div>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar v-if="mode === 'Edit'" color="primary" dark>{{
                  `Edit ${currrentItem.name} in this directory`
                }}</v-toolbar>

                <v-toolbar v-else color="primary" dark>{{
                  `${mode} ${type} in this directory`
                }}</v-toolbar>

                <v-alert v-show="errorMsg" dense outlined type="error">
                  {{ errorMsg }}
                </v-alert>
                <v-card-text>
                  <v-text-field
                    v-model="filename"
                    :label="`${mode} ${type}`"
                  ></v-text-field>
                </v-card-text>

                <v-btn color="primary" @click="create()">Submit</v-btn>
                <v-card-actions class="justify-end">
                  <v-btn
                    text
                    @click="
                      {
                        dialog.value = false;
                        edit = false;
                      }
                    "
                    >Close</v-btn
                  >
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <v-list dense>
            <v-list-item-group
              v-if="active"
              v-model="selectedItem"
              color="primary"
            >
              <v-list-item
                class="list-item"
                v-for="(item, i) in active.children"
                :key="i"
              >
                <v-list-item-icon>
                  <v-icon v-if="!item.file">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                  </v-icon>

                  <v-icon v-if="item.file">
                    {{ files[item.file] }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content @click="setShowcase(item)">
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>

                <span class="edit-span" @click="editItem(item)">
                  <i class="far fa-edit"></i
                ></span>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { File, Folder } from '../utils/blueprint';

export default {
  name: 'Home',

  data: () => ({
    initiallyOpen: ['public'],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
      css: 'mdi-language-css3',
      mp3: 'mdi-music',
      mp4: 'mdi-video',
    },
    tree: [],
    items: [
      {
        name: '.git',
        children: [
          {
            name: 'logo.png',
            file: 'png',
          },
        ],
      },
      {
        name: 'node_modules',
        children: [],
      },
      {
        name: 'public',
        children: [
          {
            name: 'static',
            children: [
              {
                name: 'logo.png',
                file: 'png',
              },
            ],
          },
          {
            name: 'favicon.ico',
            file: 'png',
          },
          {
            name: 'index.html',
            file: 'html',
          },
        ],
      },
      {
        name: '.gitignore',
        file: 'txt',
      },
      {
        name: 'babel.config.js',
        file: 'js',
      },
      {
        name: 'package.json',
        file: 'json',
      },
      {
        name: 'README.md',
        file: 'md',
      },
      {
        name: 'vue.config.js',
        file: 'js',
      },
      {
        name: 'yarn.lock',
        file: 'txt',
      },
    ],

    selectedItem: 1,
    open: '',
    errorMsg: '',
    active: null,
    showDialog: false,
    filename: '',
    type: null,
    mode: 'Create',
    currrentItem: null,
    oldName: '',
  }),

  methods: {
    onUpdate(selection) {
      console.log(selection);
    },

    updateShowcase(item) {
      console.log(item);
      if (item.children) this.active = item;
    },

    create() {
      if ((this.mode = 'Edit')) {
        const index = this.active.children.findIndex(
          (el) => el.name === this.oldName
        );

        const newObj = { ...this.active.children[index] };
        newObj.name = this.filename;
        this.active.children.splice(index, 1, newObj);
        this.showDialog = false;
      } else {
        let createdFile;
        if (this.type === 'file') createdFile = new File(this.filename);
        if (this.type === 'folder') createdFile = new Folder(this.filename);

        const found = this.active.children.find(
          (el) => el.name === createdFile.name
        );

        if (found) {
          this.errorMsg = 'File already exists in this directory';
        } else {
          this.active.children.push(createdFile);
          this.filename = '';
          this.showDialog = false;
        }
      }
    },

    setShowcase(item) {
      if (item.children) this.active = item;
    },

    editItem(item) {
      console.log(item);
      this.mode = 'Edit';
      this.currrentItem = item;

      this.filename = item.name;
      this.oldName = item.name;
      this.showDialog = true;
      if (item.children) {
        this.type = 'folder';
      } else {
        this.type = 'file';
      }
    },
  },

  watch: {
    selection(newValue) {
      this.onUpdate(newValue);
    },
  },

  mounted() {
    this.active = this.items[0];
  },
};
</script>

<style scoped>
.layout {
  display: flex;
}

.showcase {
  width: 100%;
  padding: 0 1.5rem;
}

.list {
  width: 100%;
}

.item-wrapper,
.action {
  display: flex;
  align-items: center;
  width: 100%;
}

.action {
  justify-content: space-between;
}

.action .icon {
  margin-left: 8px;
}

.btn-wrapper {
  display: flex;
  align-items: center;
}

.btn-wrapper span {
  margin: 0 5px;
}

.buttons {
  display: flex;
  justify-content: stretch;
  padding: 10px;
}

.buttons * {
  margin: 0 0.5rem;
}

.list-item {
  z-index: 1;
}

.edit-span {
  z-index: 2;
}
</style>
