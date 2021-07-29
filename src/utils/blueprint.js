export class File {
  constructor(name) {
    this.name = name;
    this.file = name.split('.')[1];
  }
}

export class Folder {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
}
