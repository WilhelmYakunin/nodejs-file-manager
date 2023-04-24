export default function hash () {
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
      let calculatedHash
      this.read(path)
      .on('data', (chunk) => {
        const createHash = this.createHash('sha256')
        calculatedHash = createHash.update(chunk).digest('hex')
      })
      .on('close', () => {
        this.outStream(`The hash of ${this.pathName} is: ${calculatedHash}`)
        this.startNewLine()
        this.showDirectory()
      })
    })
}
