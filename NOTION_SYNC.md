# Notion 每日自动同步

同步页面：https://juniper-selenium-d99.notion.site/414e4d9d57e68120bd24e9d96062b590

时间：每天 02:17 UTC / 日本时间 11:17（GitHub 定时任务可能延迟）。

生成文件：`docs/notion-sync/ros2-vln.md`。程序不会修改手写文章、网站主题和导航。

## 首次启用（必须由仓库所有者操作）

1. 在 https://www.notion.so/my-integrations 创建一个仅授予读取内容权限的 Notion 内部集成，复制 Internal Integration Secret。
2. 在该 Notion 页面右上角菜单的 Connections / 连接中，将页面授权给该集成。
3. 访问 https://github.com/sks-curry/ros2-navigation-notes/settings/secrets/actions ，选择 New repository secret，名称填 `NOTION_TOKEN`，值填密钥。
4. 打开 https://github.com/sks-curry/ros2-navigation-notes/actions/workflows/sync-notion.yml ，点击 Run workflow 测试。不要在代码、聊天或 README 中暴露密钥。

每日运行会读取 Notion 并仅更新独立生成文件，随后直接构建并部署 GitHub Pages。GitHub token 提交不会可靠地触发其他工作流，因此同步工作流自己进行部署。

注意：本仓库和网站是公开的；同步范围仅限指定页面的区块，链接的子页面不会自动抓取。Notion 托管图片和附件使用有期限的 URL，因此这类附件不会以永久链接形式公开，页面中会显示提示。复杂数据库视图及嵌入可能需要后续扩展。
