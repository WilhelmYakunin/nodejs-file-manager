export default function cd () {
    const path = this.getAbsolutePath()

    this.stat(path, (err, stats) => {
      if (err) {
        this.err = `${path} is not a folder`
        return this.showError()
      }
      if (stats.isDirectory()) {
        this.chdir(path)
        this.startNewLine()
        this.showDirectory()
      } else {
        this.chdir(path)
      }
    })
}