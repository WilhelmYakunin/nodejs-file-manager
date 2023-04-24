export default function cat () {
    const path = this.getAbsolutePath()

    this.stat(path, (err, stats) => {
      if (err) {
        this.err = `${path} is not a file`
        return this.showError()
      }
      if (stats.isFile()) {
        this.read(path)
        .on('data', (chunk) => {
          this.outStream(chunk)
          this.startNewLine()
          this.showDirectory()
        })
      }
    })
}
