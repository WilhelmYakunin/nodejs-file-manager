export default function mv() {
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


      const copyFileName = this.parsePath(path).base
      const newFilePath = this.resolvePath(this.newFileDirectory, copyFileName)

      this.stat(newFilePath, (err, stats) => {
        if (err && !err.code === 'ENOENT') {
          this.err = err
          return this.showError()
        }

        if (stats !== undefined && stats.isFile()) {
          this.err = `${path} already exists`
          return this.showError()
        }
      })

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
        this.outStream(`
        ${this.pathName} was just moved into ${this.newFileDirectory} 
        the changes will came into power after end of the session
        `)
        this.startNewLine()
        this.showDirectory()
      })
    })
}