#!/usr/bin/env node

import { stdin, stdout, argv, exit, env, chdir, cwd } from 'process'
import { readdir, stat, createReadStream, createWriteStream, unlink } from 'fs'
import { parse, resolve } from 'path'
import { EOL, cpus, homedir, arch, userInfo } from 'os'
import { createHash } from 'crypto'
import { createBrotliCompress, createBrotliDecompress } from 'zlib'
import { pipeline } from 'stream'
import FileManager from '../index.js'
import up from '../src/up.js'
import cd from '../src/cd.js'
import ls from '../src/ls.js'
import cat from '../src/cat.js'
import add from '../src/add.js'
import rn from '../src/rn.js'
import cp from '../src/cp.js'
import mv from '../src/mv.js'
import rm from '../src/rm.js'
import hash from '../src/hash.js'
import compress from '../src/compress.js'
import decompress from '../src/decompress.js'


const commands = {
    up,
    cd,
    ls,
    cat,
    add,
    rn,
    cp,
    mv,
    rm,
    hash,
    compress,
    decompress
}

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
    zip: createBrotliCompress,
    unzip: createBrotliDecompress,
    eol: EOL,
    cpus: cpus, 
    homedir: homedir,
    arch: arch,
    userInfo: userInfo,
    commands,
}

const initApp = new FileManager(defaultConfig);
if (!initApp.isCorrectUsername()) initApp.listenCommandLine()
