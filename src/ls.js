export default function ls() {
    const dirname = this.getCurrentDirName()

    this.readdir(dirname, { withFileTypes: true }, (err, elements) => {
      if (err) {
        this.err = err
        this.showError()
      }

      this.startNewLine()
      elements.forEach(elem => {
        this.outStream(elem.name)
        this.startNewLine()
      })
      this.startNewLine()
      this.showDirectory()
    })
}