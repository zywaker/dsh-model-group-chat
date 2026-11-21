# 发布到插件市场 / Publishing

这个目录是一个可直接推送到 GitHub 的 DSH 插件仓库。

## 收录机制

[dsh-plugin.org](https://dsh-plugin.org/zh/submit) 的规则：发布**公开 GitHub 仓库**，并给仓库加上 `dsh-plugin` topic，站点雷达会周期性扫描并自动收录（约 8 小时一次），随后人工审核分类。仓库需要声明 `dsh.bundle`，本包的 `package.json` 已包含。

## 步骤

1. 在 GitHub 新建公开仓库，例如 `dsh-model-group-chat`。
2. 推送本目录：

   ```powershell
   cd publish\dsh-model-group-chat
   git init
   git add .
   git commit -m "dsh-model-group-chat 1.15.0"
   git branch -M main
   git remote add origin https://github.com/<你的账号>/dsh-model-group-chat.git
   git push -u origin main
   ```

3. 仓库 **About** 旁的齿轮 → Topics 添加 `dsh-plugin`（可再加 `deepseek-harness`、`dsh`）。
4. 等待雷达收录；也可以在官网提交页确认是否已被扫描。

## 安装方式

```powershell
dsh plugin add dsh-model-group-chat            # 发布到 npm 之后
dsh plugin add github:<账号>/dsh-model-group-chat
dsh plugin add .\dsh-model-group-chat-1.15.0.tgz
```

## 发布到 npm（可选）

需要先 `npm login`，并拥有包名 `dsh-model-group-chat`：

```powershell
npm publish
```
