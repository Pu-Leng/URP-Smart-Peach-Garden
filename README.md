# 平谷智慧桃园--SmartPeachGarden

以下将会帮助你开始这个项目

## 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## 项目设置
以下命令皆是在项目根文件目录的终端中输入

```sh
pnpm install
```
上述命令将会帮助你在项目启动之前安装所需要的依赖

### 编译和使用热重载进行开发

```sh
pnpm dev
```
上述命令将会让你在开发环境下启动项目

### 编译并最小化项目以进行生产模式下的发布

```sh
pnpm build
```
上述代码将会产生一个用于分发的文件夹`dist`

### 代码校验与美化 [ESLint](https://eslint.org/)

```sh
pnpm lint-staged
```
上述代码可以让你手动开启代码的校验和美化。事实上本项目使用了git hooks 工具--husky，以在提交代码到版本库前自动进行该命令。
