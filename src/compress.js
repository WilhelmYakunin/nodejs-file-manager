export default function compress() {
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
      const fileName = path.split('\\')[path.split('\\').length - 1]
      const newFilePath = this.newFileDirectory + '\\' + fileName + '.gz'

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
    
        const gzip = this.zip()
        this.pipeline(source, gzip, writeable, (err) => {
          if (err) {
            this.err = err
            return this.showError()
          } 
          
          this.outStream(`
          ${this.pathName} was just zipped into ${newFilePath}
          `)
          this.startNewLine()
          this.showDirectory()
        })
      })
    })
  }
