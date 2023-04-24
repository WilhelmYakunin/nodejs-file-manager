export default function rm() {
    const path = this.getAbsolutePath()

    this.stat(path, (err, stats) => {
      if (err) {
        this.err = err
        return this.showError()
      }

      if (!stats.isFile()) {
        this.err = `${path} is not a file`
        return this.showError()
      }

      this.unlink(path, (err) => {
        if (err) {
          this.err = err
          return this.showError()
        }
        })
        this.outStream(`${this.pathName} was just deleted \n the changes will came into power after end of the session`)
        this.startNewLine()
        this.showDirectory()
    })
}