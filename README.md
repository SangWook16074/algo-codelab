# Code Lab

손으로 치면서 익히는 코딩테스트 · 알고리즘 학습 자료 모음.
[**codelab.hansw.dev**](https://codelab.hansw.dev) 에 배포됩니다.

## 코드랩 목록

| 코드랩 | 경로 | URL |
| --- | --- | --- |
| 파이썬 알고리즘 기초 | `ps/python/` | https://codelab.hansw.dev/ps/python/ |

## 구조

```
.
├── ps/
│   └── python/          # 각 코드랩 = honkit(GitBook) 소스 한 벌
│       ├── book.json
│       ├── README.md    # 책 표지
│       ├── SUMMARY.md   # 사이드바 목차
│       └── chapters/
├── scripts/
│   ├── build-codelab.js # honkit 소스 → _site/<경로> 빌드
│   └── build-hub.js     # 허브 랜딩(_site/index.html) + CNAME 생성
├── _site/               # 빌드 결과(배포물, git 제외)
└── .github/workflows/deploy.yml  # push 시 자동 빌드·배포
```

`codelab.hansw.dev` 루트는 허브 랜딩 페이지이고, 각 코드랩은 하위 경로(`/ps/python/` 등)로 배치됩니다.

## 로컬 개발

```bash
npm install            # 최초 1회

npm run serve:python   # 파이썬 코드랩 미리보기 (http://localhost:4000)

npm run build          # 전체 빌드 → _site/ 생성
npm run clean          # 빌드 결과 정리
```

## 새 코드랩 추가하기

1. `ps/<주제>/` 폴더에 honkit 소스 한 벌 작성 (`book.json`, `README.md`, `SUMMARY.md`, 챕터들).
2. `package.json`에 빌드 스크립트 추가: `node scripts/build-codelab.js ps/<주제> ps/<주제>`, 그리고 `build`에 연결.
3. `scripts/build-hub.js`의 `CODELABS` 배열에 카드 한 줄 추가.
4. push → GitHub Actions가 자동 배포.

## 배포

`main`에 push하면 GitHub Actions가 `npm ci && npm run build` 후 `_site/`를 GitHub Pages로 배포합니다.
커스텀 도메인 `codelab.hansw.dev`는 `scripts/build-hub.js`가 생성하는 `_site/CNAME`으로 지정됩니다.
