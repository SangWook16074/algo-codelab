// 허브 랜딩 페이지(_site/index.html)와 CNAME을 생성한다.
// 새 코드랩을 추가하려면 아래 CODELABS 배열에 한 줄만 더하면 된다.
const fs = require("fs");
const path = require("path");

const DOMAIN = "codelab.hansw.dev";

const CODELABS = [
  {
    title: "파이썬 알고리즘 기초 코드랩",
    desc: "프로그래머스 문제풀이에 꼭 필요한 파이썬 문법만. 모든 예제를 복사해 바로 실행할 수 있습니다.",
    path: "ps/python/",
    tag: "Python · 입문",
  },
  // 예시) { title: "자바 기초", desc: "...", path: "ps/java/", tag: "Java · 입문" },
];

const siteDir = path.join(__dirname, "..", "_site");
fs.mkdirSync(siteDir, { recursive: true });

const cards = CODELABS.map(
  (c) => `      <a class="card" href="${c.path}">
        <span class="tag">${c.tag}</span>
        <h2>${c.title}</h2>
        <p>${c.desc}</p>
      </a>`
).join("\n");

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>codelab.hansw.dev — 코드랩 모음</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
        "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
      background: #0f1117; color: #e6e6e6; line-height: 1.6;
    }
    .wrap { max-width: 760px; margin: 0 auto; padding: 72px 24px 96px; }
    header h1 { font-size: 2rem; margin: 0 0 8px; }
    header p { color: #9aa0aa; margin: 0 0 40px; }
    .grid { display: grid; gap: 16px; }
    .card {
      display: block; text-decoration: none; color: inherit;
      background: #171a22; border: 1px solid #262b36; border-radius: 14px;
      padding: 22px 24px; transition: border-color .15s, transform .15s;
    }
    .card:hover { border-color: #4c8bf5; transform: translateY(-2px); }
    .card .tag {
      display: inline-block; font-size: .78rem; color: #4c8bf5;
      background: rgba(76,139,245,.12); padding: 2px 10px; border-radius: 999px;
      margin-bottom: 10px;
    }
    .card h2 { margin: 0 0 6px; font-size: 1.15rem; }
    .card p { margin: 0; color: #9aa0aa; font-size: .95rem; }
    footer { margin-top: 56px; color: #6b7280; font-size: .85rem; }
    footer a { color: #6b7280; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Code Lab</h1>
      <p>손으로 치면서 익히는 코딩테스트 · 알고리즘 학습 자료 모음</p>
    </header>
    <main class="grid">
${cards}
    </main>
    <footer>
      <a href="https://github.com/SangWook16074/algo-codelab">GitHub</a> ·
      ${DOMAIN}
    </footer>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(siteDir, "index.html"), html);
fs.writeFileSync(path.join(siteDir, "CNAME"), DOMAIN + "\n");
// GitHub Pages가 _site 안의 파일을 Jekyll로 처리하지 않도록
fs.writeFileSync(path.join(siteDir, ".nojekyll"), "");

console.log("hub built:", path.join(siteDir, "index.html"));
console.log("CNAME:", DOMAIN);
