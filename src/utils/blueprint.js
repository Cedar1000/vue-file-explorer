export class File {
  constructor(name, file) {
    this.name = name;
    this.file = file || name.split('.')[1];
  }
}

export class Folder {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
}
