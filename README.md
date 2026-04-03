# 重新载入框架助手 · Refresh Frame Helper

适用于 **Safari**（macOS）的网页扩展：在 **iframe / frame** 内右键即可只刷新当前框架；也可点击**工具栏图标**一次性刷新当前标签页中所有可访问的嵌入式框架。

A Safari Web Extension for **macOS** that reloads the **iframe or frame** you right‑click, or refreshes **all top-level iframes/frames** on the page via the toolbar button.

---

## 功能特性

| 方式 | 说明 |
|------|------|
| **右键菜单** | 仅在指针位于 **iframe 内**时显示「重新载入框架页面」，只刷新该子框架，不影响整页。 |
| **工具栏图标** | 在当前页主文档中查找所有 `iframe` / `frame`，依次尝试 `location.reload()`；若因跨域无法访问，则通过重新赋值 `src` 触发加载。 |

- 国际化：界面文案支持**简体中文**与**英文**（`_locales/`）。
- 基于 **Manifest V2** 与 **非持久化后台页**（`background.js`）。

---

## 系统要求

- macOS（与当前 Safari 版本匹配）
- **Xcode**（从源码构建宿主应用与扩展）
- Safari 中启用该扩展（见下文）

---

## 从源码构建

1. 克隆本仓库：
   ```bash
   git clone https://github.com/meetrize/safari-refreshframe.git
   cd safari-refreshframe
   ```

2. 用 Xcode 打开工程：
   ```text
   SafariRefreshFrameApp/Refresh Frame Helper/Refresh Frame Helper.xcodeproj
   ```

3. 在 Xcode 顶部 Scheme 中选择 **「Refresh Frame Helper」**（宿主应用），运行目标为 **My Mac**，执行 **Product → Run**（`⌘R`）。

首次运行后，扩展会随宿主应用安装到本机。

---

## 在 Safari 中启用

1. 打开 **Safari → 设置…**（或 **系统设置 → Safari → 扩展**，视系统版本而定）。
2. 进入 **扩展**，在列表中找到本扩展并勾选启用。
3. 按提示授予其访问的网站权限（如「所有网站」或按需选择）。

若使用**未签名**的本地构建，可能需在 **Safari → 设置 → 开发者**中启用「允许未签名的扩展」；**该选项在退出 Safari 后可能被系统重置**，属 Apple 的安全策略。长期免勾选需使用 [Apple Developer Program](https://developer.apple.com/programs/) 对应用与扩展进行正式签名（及按需公证）。

---

## 项目结构（概要）

```text
.
├── manifest.json          # Web 扩展清单（MV2）
├── background.js          # 右键菜单、工具栏点击、脚本注入
├── icons/                 # 扩展图标（16 / 48 / 128）
├── _locales/              # 英文、简体中文文案
└── SafariRefreshFrameApp/ # Xcode 宿主应用 + Safari Web Extension 目标
```

根目录下的 `manifest.json`、`background.js`、`icons`、`_locales` 由 Xcode 的 Extension 目标打包进 `.appex`。

---

## 权限说明

- **`contextMenus`**：注册「重新载入框架页面」右键项。
- **`tabs`**：向当前标签页注入刷新脚本。
- **`<all_urls>`**：在一般网页中执行注入（请仅在信任的扩展中使用）。

---

## 已知限制

- 仅刷新**挂在当前顶层文档 DOM 上**的 `iframe` / `frame`；嵌套页面会随外层框架整体重载而更新。
- 跨域 iframe 无法调用 `contentWindow.reload` 时依赖 `src` 重设，若页面无 `src` 或特殊嵌入方式，行为取决于站点实现。
- 部分 Apple / 受限页面可能禁止扩展注入，属浏览器策略。

---

## 许可证

若仓库未包含 `LICENSE` 文件，可自行添加（例如 MIT），并在发布前确认图标与依赖的授权。

---

## English summary

**Refresh Frame Helper** is a macOS Safari Web Extension. **Right‑click inside a subframe** to reload only that iframe/frame via the context menu, or click the **toolbar icon** to reload all top-level `iframe` / `frame` elements on the active tab (with a `src` fallback when cross-origin blocks `reload`). Build the **Refresh Frame Helper** app target in Xcode, enable the extension under Safari **Settings → Extensions**, and grant site access as prompted.
