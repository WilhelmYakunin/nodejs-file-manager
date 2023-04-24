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
    unzip,
    commands
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
    this.up = commands.up.bind(this)
    this.compress = commands.compress.bind(this)
    this.decompress = commands.decompress.bind(this)
    this.cd = commands.cd.bind(this)
    this.ls = commands.ls.bind(this)
    this.hash = commands.hash.bind(this)
    this.cat = commands.cat.bind(this)
    this.add = commands.add.bind(this)
    this.rn = commands.rn.bind(this)
    this.cp = commands.cp.bind(this)
    this.mv = commands.mv.bind(this)
    this.rm = commands.rm.bind(this)
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
    this.up()
  }

  cd() {
    this.cd()
  }

  ls() {
    this.ls()
  }

  cat() {
    this.cat()
  }

  add() {
    this.add()
  }

  rn() {
    this.rn()
  }

  cp() {
    this.cp()
  }

  mv() {
    this.mv()
  }

  rm() {
    this.rm()
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
    this.hash()
  }

  compress() {
    this.compress()
  }

  decompress() {
    this.decompress()
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

      if (!newFileName) {
        this.err = `incorrect destination folder`
        return this.showError()
      }

      this.pathName = currentPath
      this.newFileName = newFileName
    }

    if (/^cp /i.test(this.input)) {
      const userInput = this.input
      this.input = 'cp'
      const pathNames = userInput.replace(/^cp /, '').split(' ')
      const currentPath = pathNames[0]
      const newFileName = pathNames[1]
 
      if (!newFileName) {
        this.err = `incorrect destination folder`
        return this.showError()
      }

      this.pathName = currentPath
      this.newFileDirectory = newFileName
    }

    if (/^mv /i.test(this.input)) {
      const userInput = this.input
      this.input = 'mv'
      const pathNames = userInput.replace(/^mv /, '').split(' ')
      const currentPath = pathNames[0]
      const newFileName = pathNames[1]

      if (!newFileName) {
        this.err = `incorrect destination folder`
        return this.showError()
      }

      this.pathName = currentPath
      this.newFileDirectory = newFileName
    }

    if (/^rm /i.test(this.input)) {
      const userInput = this.input
      this.input = 'rm'
      this.pathName = userInput.replace(/^rm /, '')

      if (!pathName) {
        this.err = `incorrect filename`
        return this.showError()
      }
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
            case '--EOL':
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