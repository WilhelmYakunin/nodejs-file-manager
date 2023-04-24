export default function rn() {
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

      const directory = this.parsePath(path).dir

      const newFilePath = this.resolvePath(directory, this.newFileName)
      const writeable = this.writer(newFilePath)
      this.read(path)
      .on('data', (chunk) => {
        writeable.write(chunk)
      })
      .on('close', () => {
        this.unlink(path, (err) => {
          if (err) {
            this.err = err
            return this.showError()
          }
        })
        this.outStream(`${this.pathName} was just renamed \r\n the changes will came into power after end of the session`)
        this.startNewLine()
        this.showDirectory()
      })
    })
}