class FileManager {
  constructor({
    version, 
    description,
    username,
    inputStream,
    outStream,
    newLine,
    exitFunc,
    root,
    getCurrentDirName,
    parsePath,
    resolvePath, 
    chdir,
    stat,
    readdir,
    read,
    writer,
    unlink
  }) {
    this.version = version
    this.programmDescription = description
    this.input = 'idle'
    this.err = 'none'
    this.folderpathName = 'idle'
    this.inputStream = inputStream
    this.outStream = (data) => outStream.write(data)
    this.newLine = newLine
    this.username = username
    this.exit = exitFunc
    this.root = root
    this.initFolder = getCurrentDirName()
    this.getCurrentDirName = getCurrentDirName
    this.parsePath = parsePath
    this.resolvePath = resolvePath
    this.chdir = chdir
    this.stat = stat
    this.readdir = readdir
    this.read = read
    this.writer = writer
    this.unlink = unlink
  }

  startNewLine() {
    this.outStream(this.newLine)
  }

  sayHi() {
    this.outStream(`Welcome to the File Manager, ${this.username}!`)
    this.startNewLine()
  }

  sayBye() {
    this.outStream(`Thank you for using File Manager, ${this.username}!`)
    this.startNewLine()
  }

  isCorrectUsername() {
    if (!(/--username=/.test(this.username))) {
      this.outStream(
      `      Enter failed, to start File manager needs to put -- --username=username,
      where 'username' is the username by your choice.
      Going afterwards arguments will be ignored`)
      this.startNewLine()
      this.exit()
    } else {
      this.username = this.username.replace( /--username=/g, '')
      this.sayHi()
    }
  }

  showError() {
    this.outStream(`Operation failed: ${this.err}`)
    this.startNewLine()
  }

  showDirectory() {
    const dirname = this.getCurrentDirName()

    this.outStream('You are currently in ' + dirname)
    this.startNewLine()
  }

  showRoot() {
    const root = this.root

    this.outStream('You are currently in ' + root)
    this.startNewLine()
  }

  getAbsolutePath() {
    const folderInput = this.pathName

    if (folderInput.slice(0, 2) === './') {
      return this.getCurrentDirName() + '\\' + folderInput.replace(/.\//, '')
    }

    return folderInput
  }

  up() {
    const dirname = this.getCurrentDirName()
    if (dirname === this.initFolder) {
      return this.showDirectory()
    }
    const currentDir = this.getCurrentDirName()
    const path = currentDir.slice(0, currentDir.lastIndexOf('\\'))

    this.chdir(path)
    this.showDirectory()
  }

  cd() {
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
      }
    })
  }

  ls() {
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

  cat() {
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

  add() {
    const path = this.getCurrentDirName() + '/' + this.pathName

    this.writer(path)
      this.outStream(`${this.pathName} has just created`)
      this.startNewLine()
      this.showDirectory()
  }

  rn() {
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
        this.outStream(`${this.pathName} was just renamed`)
        this.startNewLine()
        this.showDirectory()
      })
    })
  }

  parseArgs() {
    if (/^cd /i.test(this.input)) {
      const userInput = this.input
      this.input = 'cd'
      this.pathName = userInput.replace(/^cd /, '')
    }

    if (/^cat /i.test(this.input)) {
      const userInput = this.input
      this.input = 'cat'
      this.pathName = userInput.replace(/^cat /, '')
    }

    if (/^add /i.test(this.input)) {
      const userInput = this.input
      this.input = 'add'
      this.pathName = userInput.replace(/^add /, '')
    }

    if (/^rn /i.test(this.input)) {
      const userInput = this.input
      this.input = 'rn'
      const pathNames = userInput.replace(/^rn /, '').split(' ')
      const currentPath = pathNames[0]
      const newFileName = pathNames[1]
      this.pathName = currentPath
      this.newFileName = newFileName
    }
  }

  logVersion() {
    this.outStream(this.version)
    this.startNewLine()
  }

  logDescription() {
    this.outStream(this.description)
    this.startNewLine()
  }

  listenCommandLine() {
    this.showRoot()

    const inputStrem = this.inputStream
    
    inputStrem
      .on('readable', () => {
        let chunk;

        while (null !== (chunk = inputStrem.read())) {
          this.input = String(chunk).replace(/\r?\n|\r/g, '');
        
          this.parseArgs()

          switch (this.input) {
            case 'ls':
              this.ls()
              break
            case '-v':
              case '--version':
                this.logVersion()
                break
            case '-desc':
              case '--description':
                this.logDescription()
                break
            case 'cd':
              this.cd()
              break
            case 'up':
              this.up()
              break
            case 'cat':
              this.cat()
              break
            case 'add':
              this.add()
              break
            case 'rn':
              this.rn()
              break 
            case '.exit':
              this.sayBye()
              this.exit(1)
              break
          case '':
            this.outStream('epmty input')
            this.startNewLine()
            break
          default:
            this.outStream(`'${this.input}' is invalid input`)
            this.startNewLine()
        }
      }
    });
  }
}

export default FileManager;
