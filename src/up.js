export default function up () {
    const dirname = this.getCurrentDirName()
    if (dirname === this.root) {
      return this.showDirectory()
    }
    const currentDir = this.getCurrentDirName()
    const path = currentDir.slice(0, currentDir.lastIndexOf('\\')) + '\\'
    this.chdir(path)
    this.showDirectory()
}
