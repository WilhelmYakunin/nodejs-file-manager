#!/usr/bin/env node

import { stdin, stdout, argv, exit, env, chdir, cwd } from 'process'
import { readdir, stat, createReadStream, createWriteStream, unlink } from 'fs'
import { parse, resolve } from 'path'
import { EOL, cpus, homedir, arch, userInfo } from 'os'
import { createHash } from 'crypto'
import { createGzip, createGunzip } from 'zlib'
import { pipeline } from 'stream'
import FileManager from '../index.js'

const defaultConfig = {
    version: '0.0.1',
    description: `File Manager uses Node.js APIs.

    The file manager is able to do the following:  
    - Work using CLI Perform basic file operations (copy, move, delete, rename, etc.) 
    - Utilize Streams API 
    - Get information about the host machine operating system 
    - Perform hash calculations 
    - Compress and decompress files`,
    username: argv[2],
    inputStream: stdin,
    outStream: stdout,
    newLine: '\r\n',
    exitFunc: exit,
    root: env.HOME,
    chdir: chdir,
    getCurrentDirName: cwd,
    parsePath: parse,
    resolvePath: resolve, 
    readdir: readdir,
    stat: stat,
    read: createReadStream,
    writer: createWriteStream,
    unlink: unlink,
    createHash: createHash,
    pipeline: pipeline,
    zip: createGzip,
    unzip: createGunzip,
    eol: EOL,
    cpus: cpus, 
    homedir: homedir,
    arch: arch,
    userInfo: userInfo
}

const initApp = new FileManager(defaultConfig);
if (!initApp.isCorrectUsername()) initApp.listenCommandLine()
