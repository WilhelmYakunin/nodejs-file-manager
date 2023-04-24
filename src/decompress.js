export default function decompress () {
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

      const newFileBase = this.parsePath(path).base.slice(0, -3)
      const newFilePath = this.resolvePath(this.newFileDirectory, newFileBase)

      this.stat(newFilePath, (err, stats) => {
        if (err && !err.code === 'ENOENT') {
          this.err = err
          return this.showError()
        }

        if (stats !== undefined && stats.isFile()) {
          this.err = `${newFilePath} already exists`
          return this.showError()
        }

        const writeable = this.writer(newFilePath)
        const source = this.read(path)
        const upzip = this.unzip()
        this.pipeline(source, upzip, writeable, (err) => {
          if (err) {
            this.err = err
            return this.showError()
          }
          this.outStream(`
          ${this.pathName} was just unzipped into ${newFilePath}
          `)
          this.startNewLine()
          this.showDirectory()
        })    
      })   
    })
  }