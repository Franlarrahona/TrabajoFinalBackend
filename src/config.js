import path from "path";
import { Command } from "commander";
import dotenv from 'dotenv';


const commandLine = new Command();
commandLine
    .option('--mode <mode>')
    .option('--port <port>')
    .option('--setup <number>')
commandLine.parse();

const clOptions = commandLine.opts();

dotenv.config({ path: clOptions.mode === 'devel' ? '.env.devel' : '.env.prod'});

const config = {
    APP_NAME: 'TrabajoCoderFraciscoLarrahoa',
    PORT:  5050,
    SERVER: 'atlas_16',
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')), // Win
    get UPLOAD_DIR() { return `${this.DIRNAME}/uploads` },
    get BASEDIR(){return this.DIRNAME.slice(0, -4) },
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET: process.env.SECRET,
    PRODUCTS_PER_PAGE:10,
    GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
    GMAIL_APP_USER: process.env.GMAIL_APP_USER,
}

export default config;