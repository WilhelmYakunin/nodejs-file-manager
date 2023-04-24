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
    unlink,
    eol,
    cpus, 
    homedir,
    arch,
    userInfo,
    pipeline,
    createHash,
    zip,
    unzip
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
    this.eol = eol
    this.cpus = cpus 
    this.homedir = homedir
    this.arch = arch
    this.userInfo = userInfo
    this.pipeline = pipeline
    this.createHash = createHash
    this.zip = zip
    this.unzip = unzip
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

    if (folderInput) {
      if (folderInput.slice(0, 2) === './') {
        return this.getCurrentDirName() + '\\' + folderInput.replace(/.\//, '')
      }
  
      return folderInput
    }
    this.err = `incorrect input folder`
    this.showError()
    return this.getCurrentDirName()
  }

  up() {
    const dirname = this.getCurrentDirName()
    if (dirname === this.root) {
      return this.showDirectory()
    }
    const currentDir = this.getCurrentDirName()
    const path = currentDir.slice(0, currentDir.lastIndexOf('\\')) + '\\'
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
      } else {
        this.chdir(path)
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
        this.outStream(`${this.pathName} was just renamed \n the changes will came into power after end of the session`)
        this.startNewLine()
        this.showDirectory()
      })
    })
  }

  cp() {
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
        this.outStream(`${this.pathName} was just copied`)
        this.startNewLine()
        this.showDirectory()
      })
    })
  }

  mv() {
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

  rm() {
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

  logEol() {
    const toPrint = JSON.stringify(this.eol)
    this.outStream(toPrint)
    this.startNewLine()
  }

  logCpus() {
    const toPrint = JSON.stringify(this.cpus(), null, 2)
    this.outStream(toPrint)
    this.startNewLine()
  }

  logHomedir() {
    const toPrint = this.homedir()
    this.outStream(toPrint)
    this.startNewLine()
  }

  logUsername() {
    const toPrint = this.userInfo().username
    this.outStream(toPrint)
    this.startNewLine()
  }

  logArch() {
    const toPrint = this.arch()
    this.outStream(toPrint)
    this.startNewLine()
  }

  hash() {
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

  compress() {
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

  decompress() {
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

    if (/^cp /i.test(this.input)) {
      const userInput = this.input
      this.input = 'cp'
      const pathNames = userInput.replace(/^cp /, '').split(' ')
      const currentPath = pathNames[0]
      const newFileName = pathNames[1]
      this.pathName = currentPath
      this.newFileDirectory = newFileName
    }

    if (/^mv /i.test(this.input)) {
      const userInput = this.input
      this.input = 'mv'
      const pathNames = userInput.replace(/^mv /, '').split(' ')
      const currentPath = pathNames[0]
      const newFileName = pathNames[1]
      this.pathName = currentPath
      this.newFileDirectory = newFileName
    }

    if (/^rm /i.test(this.input)) {
      const userInput = this.input
      this.input = 'rm'
      this.pathName = userInput.replace(/^rm /, '')
    }

    if (/^os /i.test(this.input)) {
      const userInput = this.input
      this.input = userInput.replace(/^os /, '')
    }

    if (/^hash/i.test(this.input)) {
      const userInput = this.input
      this.input = 'hash'
      this.pathName = userInput.replace(/^hash /, '')
    }

    if (/^compress /i.test(this.input)) {
      const userInput = this.input
      this.input = 'compress'
      const pathNames = userInput.replace(/^compress /, '').split(' ')
      const currentPath = pathNames[0]
      const newFileName = pathNames[1]
      this.pathName = currentPath
      this.newFileDirectory = newFileName
    }

    if (/^decompress /i.test(this.input)) {
      const userInput = this.input
      this.input = 'decompress'
      const pathNames = userInput.replace(/^decompress /, '').split(' ')
      const currentPath = pathNames[0]
      const newFileDir = pathNames[1]
      this.pathName = currentPath
      this.newFileDirectory = newFileDir
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
    this.chdir(this.root)
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
            case 'cp':
              this.cp()
              break
            case 'mv':
              this.mv()
              break 
            case 'rm':
              this.rm()
              break
            case '--eol':
              this.logEol()
              break
            case '--cpus':
              this.logCpus()
              break
            case '--homedir':
              this.logHomedir()
              break
            case '--username':
              this.logUsername()
              break
            case '--architecture':
              this.logArch()
              break
            case 'hash':
              this.hash()
              break
            case 'compress':
              this.compress()
              break
            case 'decompress':
              this.decompress()
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
    })
  }
}

export default FileManager;
