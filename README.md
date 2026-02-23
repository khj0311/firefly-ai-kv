# Firefly AI KV - 프로젝트 가이드

## 프로젝트 개요
드래그앤드롭으로 이미지를 자유롭게 탐색하고, 특정 이미지 클릭 시 관련 콘텐츠가 다이나믹한 슬라이드 애니메이션으로 펼쳐지는 인터랙티브 프로젝트

## 개발 환경
- **Framework**: React 18.2
- **Language**: TypeScript 5.4.5
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Vite 5.0
- **Icons**: Lucide React
- **Animation**: GSAP 3.12
- **Package Manager**: yarn

## 프로젝트 구조
```
firefly-ai-kv/
├── src/
│   ├── components/
│   │   ├── card/           # 카드 컴포넌트
│   │   └── popup/          # 팝업 컴포넌트 (SlidePopup, VideoPopup)
│   ├── hooks/              # 커스텀 훅 (useDraggable)
│   ├── data/               # 데이터 관리 (contents)
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── index.css           # 글로벌 스타일
│   └── main.tsx            # 앱 진입점
├── task/                   # 작업 로그
├── public/                 # 정적 파일
├── dist/                   # 빌드 결과물
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── .eslintrc.cjs
```

## 주요 기능
1. **드래그앤드롭 네비게이션**: GSAP Draggable을 활용한 자유로운 이미지 탐색
2. **슬라이드 팝업**: 이미지 클릭 시 관련 콘텐츠를 슬라이드로 표시
3. **비디오 팝업**: 비디오 카드 클릭 시 비디오 재생 팝업
4. **반응형 레이아웃**: viewport 단위를 활용한 유연한 레이아웃

## 시작하기
```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 코드 린트
yarn lint
```

## 주요 컴포넌트
- **App.tsx**: 메인 앱 컴포넌트, 드래그 가능한 컨테이너와 팝업 관리
- **SlidePopup**: 이미지 클릭 시 표시되는 슬라이드 팝업
- **VideoPopup**: 비디오 재생 팝업
- **useDraggable**: GSAP Draggable을 활용한 드래그 기능 커스텀 훅

## 스타일링
프로젝트는 Tailwind CSS를 사용합니다.
- 기본 색상: primary, background, text
- 폰트: samsung-sharp, samsung-one, samsung-one-kr
- Utility-first 접근 방식

## 코딩 컨벤션
- **들여쓰기**: 2 spaces
- **세미콜론**: 사용
- **따옴표**: single quotes
- **최대 라인 길이**: 100자
- **불필요한 콘솔 로그**: 지양
- **컴포넌트 명명**: PascalCase
- **함수/변수 명명**: camelCase
- **타입 정의**: 명시적 타입 선언 권장


## 개발 가이드라인
1. **SCSS 사용**: 요청사항에 scss 사용이 명시되어 있으나, 현재는 Tailwind CSS를 사용 중
2. **효율적인 코드**: 간결하고 읽기 쉬운 코드 작성
3. **타입 안정성**: TypeScript를 활용한 타입 안정성 확보
4. **성능 최적화**: useMemo, useCallback 등을 활용한 최적화
5. **독립적 작업**: 명시된 요청사항만 작업, 추측성 작업 지양
