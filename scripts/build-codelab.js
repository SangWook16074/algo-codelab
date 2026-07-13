// 개별 코드랩(honkit 소스)을 _site/<outPath> 로 빌드한다.
// honkit은 상대 출력경로를 소스 디렉토리 기준으로 해석하므로,
// 반드시 절대경로를 넘겨야 _site 아래에 올바르게 생성된다.
//
// 사용법: node scripts/build-codelab.js <srcDir> <outSubPath>
//   예: node scripts/build-codelab.js ps/python ps/python
const { execFileSync } = require("child_process");
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
console.log(`built: ${srcDir} -> _site/${outSubPath}`);
