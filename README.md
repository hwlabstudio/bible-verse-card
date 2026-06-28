# 나에게 주시는 새해 말씀

HTML, CSS, JavaScript만으로 만든 정적 말씀카드 랜덤 뽑기 웹앱입니다. 버튼을 누르면 준비된 말씀 중 하나가 랜덤으로 선택되고, 1080 x 1350px Canvas 카드로 렌더링됩니다.

## 실행 방법

별도 설치가 필요 없습니다.

1. `bible-verse-card/index.html` 파일을 브라우저에서 엽니다.
2. `새해 말씀카드 뽑기` 버튼을 눌러 카드를 생성합니다.
3. `이미지 저장` 버튼을 눌러 PNG 파일을 다운로드합니다.

로컬 서버로 확인하고 싶다면 프로젝트 상위 폴더에서 다음 명령을 실행한 뒤 브라우저에서 접속할 수 있습니다.

```bash
python3 -m http.server 8000
```

접속 주소:

```text
http://localhost:8000/bible-verse-card/
```

## 말씀 추가 방법

`bible-verses.js`의 `VERSES` 배열에 아래 형식으로 객체를 추가하면 됩니다.

```js
{
  verse: "말씀 내용",
  reference: "성경 권 장:절",
}
```

처음에는 샘플 5개만 들어 있습니다. 같은 형식으로 계속 추가하면 50개 이상으로도 쉽게 늘릴 수 있습니다.

## 배포 방법

### GitHub Pages

1. 저장소에 `bible-verse-card` 폴더를 업로드합니다.
2. GitHub 저장소의 `Settings > Pages`에서 배포 브랜치와 폴더를 선택합니다.
3. 생성된 Pages 주소로 접속합니다.

### Cloudflare Pages

1. Cloudflare Pages에서 Git 저장소를 연결합니다.
2. 빌드 명령은 비워둡니다.
3. 배포 폴더를 `bible-verse-card`로 지정합니다.

정적 파일만 사용하므로 별도 서버나 프레임워크가 필요 없습니다.
