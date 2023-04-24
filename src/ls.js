export default function ls() {
    const dirname = this.getCurrentDirName()

    this.readdir(dirname, { withFileTypes: true }, (err, elements) => {
      if (err) {
        this.err = err
        this.showError()
      }

      this.startNewLine()

      function ShowTable(elem) {
        const methods = ['isBlockDevice', 'isCharacterDevice', 'isDirectory', 'isFIFO', 'isFile', 'isSocket', 'isSymbolicLink'];
        this.name = elem.name;
        
        this.type = methods.filter(method => elem[method]())[0].replace(/is/, '')
      }
      console.table(elements.map((elem) => new ShowTable(elem)))
      
      this.startNewLine()
      this.showDirectory()
    })
}