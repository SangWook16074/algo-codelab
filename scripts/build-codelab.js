// 개별 코드랩(honkit 소스)을 _site/<outPath> 로 빌드한다.
// honkit은 상대 출력경로를 소스 디렉토리 기준으로 해석하므로,
// 반드시 절대경로를 넘겨야 _site 아래에 올바르게 생성된다.
//
// 사용법: node scripts/build-codelab.js <srcDir> <outSubPath>
//   예: node scripts/build-codelab.js ps/python ps/python
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const [srcDir, outSubPath] = process.argv.slice(2);
if (!srcDir || !outSubPath) {
  console.error("usage: node scripts/build-codelab.js <srcDir> <outSubPath>");
  process.exit(1);
}

const root = path.join(__dirname, "..");
const absSrc = path.join(root, srcDir);
const absOut = path.join(root, "_site", outSubPath);
const honkitBin = path.join(root, "node_modules", ".bin", "honkit");

execFileSync(honkitBin, ["build", absSrc, absOut], { stdio: "inherit" });

// honkit의 book.json "js" 는 이 버전에서 <script> 태그로 안 들어간다.
// 빌드된 모든 HTML의 </body> 앞에 토글 스크립트를 직접 주입한다.
// 페이지 깊이(챕터=../, advanced=../../)에 맞춰 상대경로를 계산.
let injected = 0;
function injectToggle(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      injectToggle(full);
    } else if (entry.name.endsWith(".html")) {
      let html = fs.readFileSync(full, "utf8");
      if (/<script[^>]+theme-toggle\.js/.test(html)) continue; // 중복 방지
      const rel = path.relative(path.dirname(full), absOut);
      const prefix = rel === "" ? "" : rel.split(path.sep).join("/") + "/";
      const tag = `<script src="${prefix}styles/theme-toggle.js"></script>`;
      if (html.includes("</body>")) {
        fs.writeFileSync(full, html.replace("</body>", tag + "\n</body>"));
        injected++;
      }
    }
  }
}
injectToggle(absOut);

console.log(`built: ${srcDir} -> _site/${outSubPath} (토글 주입 ${injected}개 페이지)`);
