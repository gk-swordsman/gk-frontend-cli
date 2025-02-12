#!/usr/bin/env node
import { Command } from "commander";
import { create } from "./template";
import { inputProjectName } from "./prompt";
import { spawnProcess, isExistsFile } from "./utils";
import * as path from "node:path";
import * as packageJson from "../../package.json";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// 声明主命令
program
  .name("jzt")
  .description("Hello, 欢迎使用 jzt-cli 脚手架! ")
  .version(packageJson.version, "-v, --version", "查看脚手架工具当前版本号")
  .helpOption("-h, --help", "查看对应的命令介绍")
  .usage("<command> [options]");

// 声明create创建命令
program
  .command("create")
  .alias("c")
  .description("创建一个新项目")
  .argument("[name]", "项目名称")
  .argument("[template]", "模版序号")
  .option("-f, --force", "如果目标文件存在，则强制覆盖") // 强制覆盖
  .action(async (name, templateKey, options) => {
    let projectName = name;
    if (!name) {
      projectName = await inputProjectName();
    }
    const isExists = await isExistsFile(projectName, options);
    if (isExists) return;
    create(projectName, templateKey);
  });

// 声明ui配置页面
program
  .command("ui")
  .description("启动并且打开ui配置页面")
  .option(
    "-p, --port <port>",
    "Port used for the UI server (by default search for available port)"
  )
  .option("--quiet", `Don't output starting messages`)
  .action(async (options) => {
    // 启动cli-server
    try {
      const cwdPath = process.cwd();
      const execFile = path.join(__dirname, "../cli-server/index.mjs");
      await spawnProcess("node", [execFile, `cwdPath = ${cwdPath}`]);
    } catch (error) {
      process.exit(1);
    }
  });

// ⭐ 声明子命令
// program
//   .command("gen")
//   .description("子命令描述") // 命令描述
//   .option("-e, --ele <ddd>", "布尔选项描述") // 选项不能和主命令选项重名，否则为空
//   .argument("<argument1Name>", "参数1描述") // 参数，必填
//   .argument("<argument2Name>", "参数2描述") // 参数，必填
//   /*
//         argument 与 option 共存时：参数1为argument，参数2为option；否则参数1是argument或option
//         添加多个argument时，依次为action的参数1、参数2、参数3
//     */
//   .action(async (argument1Name, argument2Name, options) => {
//     console.log("action", argument1Name, argument2Name, options);
//   });

// // ⭐ 自定义监听事件（目前只确定可以监听主命令 option）
// program.on("option:dir", function (optionValue) {
//   console.log("option:dir", optionValue);
// });

// 解析用户执行命令传入的参数
program.parse(process.argv);
