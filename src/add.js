export default function add() {
    const path = this.getCurrentDirName() + '/' + this.pathName

    this.writer(path)
      this.outStream(`${this.pathName} has just created`)
      this.startNewLine()
      this.showDirectory()
}