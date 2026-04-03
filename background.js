// 背景脚本：工具栏图标刷新全部可访问 iframe，以及 iframe 内右键菜单（MV2 事件页）
const MENU_ID = "refresh-frame";

// 注入主文档：刷新当前文档中所有顶层 iframe/frame（嵌套子框架会随外层重载一并更新）；跨域无法调用 reload 时改 src
const REFRESH_ALL_IFRAMES_CODE = String.raw`
(function () {
  var list = document.querySelectorAll("iframe, frame");
  for (var i = 0; i < list.length; i++) {
    var el = list[i];
    try {
      if (el.contentWindow) el.contentWindow.location.reload();
    } catch (e) {
      var src = el.getAttribute("src");
      if (src) el.src = src;
    }
  }
})();
`;

function createMenu() {
  // 先清理旧菜单，避免重复注册
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: chrome.i18n.getMessage("menu_refresh_frame"),
      // Safari 对 contexts:"frame" 支持不完善，改为 all，再用 onShown 过滤
      contexts: ["all"]
    });
  });
}

chrome.runtime.onInstalled.addListener(createMenu);
chrome.runtime.onStartup?.addListener(createMenu);

// 仅当点击发生在 iframe 内时显示菜单
chrome.contextMenus.onShown?.addListener((info, tab) => {
  const inFrame = typeof info.frameId === "number" && info.frameId > 0;
  chrome.contextMenus.update(MENU_ID, { visible: inFrame }, () => {
    if (chrome.runtime.lastError) {
      console.warn("更新菜单可见性失败：", chrome.runtime.lastError.message);
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab?.id) return;

  // frameId 为 0 代表顶层文档，需求限定 iframe，因此直接忽略
  if (typeof info.frameId !== "number" || info.frameId === 0) return;

  chrome.tabs.executeScript(
    tab.id,
    {
      code: "location.reload();",
      frameId: info.frameId
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn("刷新 frame 失败：", chrome.runtime.lastError.message);
      }
    }
  );
});

// 点击工具栏图标：在当前活动页主 frame 中刷新所有 iframe/frame
chrome.browserAction.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  chrome.tabs.executeScript(
    tab.id,
    { code: REFRESH_ALL_IFRAMES_CODE, frameId: 0 },
    () => {
      if (chrome.runtime.lastError) {
        console.warn("批量刷新 iframe 失败：", chrome.runtime.lastError.message);
      }
    }
  );
});
