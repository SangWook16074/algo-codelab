// 다크/라이트 토글. 우선순위: 사용자 선택(localStorage) > 시스템(prefers-color-scheme).
// CSS는 html[data-theme]와 @media(prefers-color-scheme)로 색을 정하므로,
// 여기서는 data-theme 속성만 관리하면 된다.
(function () {
  var KEY = "codelab-theme";

  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // 저장된 선택이 있으면 그 값을, 없으면 속성을 비워 CSS의 시스템 기본값을 따르게 둔다.
  function applyStored() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  // 현재 실제 표시 중인 테마(속성 없으면 시스템값)
  function effectiveTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return systemPrefersDark() ? "dark" : "light";
  }

  function toggle() {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch (e) {}
    document.documentElement.setAttribute("data-theme", next);
    updateButton();
  }

  var btn;
  function updateButton() {
    if (!btn) return;
    var t = effectiveTheme();
    // 다크일 때 노브를 오른쪽(달)으로, 라이트일 때 왼쪽(해)으로
    btn.classList.toggle("is-dark", t === "dark");
    btn.setAttribute("aria-checked", t === "dark" ? "true" : "false");
    btn.setAttribute("aria-label", t === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환");
    btn.setAttribute("title", t === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환");
  }

  function insertButton() {
    // honkit 헤더 DOM에 의존하지 않고 화면 우상단에 고정 배치한다.
    // (헤더가 없거나 pjax로 갈아끼워져도 항상 보이도록)
    if (document.getElementById("theme-toggle")) return;
    btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.setAttribute("role", "switch");
    // iOS 스타일 스위치: 미끄러지는 노브 안에서 해 ↔ 달이 교차 페이드.
    // 배경에는 작은 별들(다크일 때만 보임)로 밤하늘 느낌.
    var sun =
      '<svg class="tt-sun" viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="5"></circle>' +
      '<g stroke-linecap="round">' +
      '<line x1="12" y1="1.5" x2="12" y2="4"></line>' +
      '<line x1="12" y1="20" x2="12" y2="22.5"></line>' +
      '<line x1="1.5" y1="12" x2="4" y2="12"></line>' +
      '<line x1="20" y1="12" x2="22.5" y2="12"></line>' +
      '<line x1="4.2" y1="4.2" x2="6" y2="6"></line>' +
      '<line x1="18" y1="18" x2="19.8" y2="19.8"></line>' +
      '<line x1="19.8" y1="4.2" x2="18" y2="6"></line>' +
      '<line x1="6" y1="18" x2="4.2" y2="19.8"></line>' +
      '</g></svg>';
    var moon =
      '<svg class="tt-moon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>' +
      '</svg>';
    btn.innerHTML =
      '<span class="tt-stars"></span>' +
      '<span class="tt-knob">' + sun + moon + '</span>';
    btn.addEventListener("click", toggle);
    document.body.appendChild(btn);
    updateButton();
  }

  // 초기 적용은 최대한 빨리(깜빡임 최소화)
  applyStored();

  // 시스템 테마가 바뀌면(사용자 수동선택 없을 때) 아이콘 갱신
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () {
      var saved = null;
      try { saved = localStorage.getItem(KEY); } catch (e) {}
      if (!saved) updateButton();
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // honkit은 페이지 전환이 pjax라서, gitbook.events 로 매 페이지마다 버튼 재삽입
  function ready() {
    insertButton();
    if (window.gitbook && window.gitbook.events) {
      window.gitbook.events.on("page.change", function () {
        applyStored();
        insertButton();
      });
    }
  }
  if (document.readyState !== "loading") ready();
  else document.addEventListener("DOMContentLoaded", ready);
})();
