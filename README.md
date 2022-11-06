# Vanilla JS로 Single Page Application 구현하기

## 기본 흐름

`index.js` <- `app.js` <- `/components/pages/index.js`

### 1. 라우팅 기능 구현

- 어떻게 하나의 페이지에서 `url`이 변경되고 그에 따라 다른 화면이 출력될 수 있을까?
  <br>

1. **내부의 태그들을 전부 삭제한 후, 해당되는 태그를 삽입한다.** (페이지별 렌더링 원리)

2. `history`를 활용한다. (url 변경 원리)
   <br>

`replaceState()` vs `pushState()`

```html
<body>
  <button id="a">a</button>
  <button id="b">b</button>
  <button id="c">c</button>
  <button id="a_aa">a/aa</button>
  <button id="b_bb">b/bb</button>
  <button id="a_aa_3">a/aa/3</button>
  <button id="re">re</button>
</body>
```

```javascript
document.querySelector("#a").addEventListener("click", function () {
  history.pushState({ data: "데이터a", garbage: "1" }, "title a", "/a");
});

document.querySelector("#b").addEventListener("click", function () {
  history.pushState({ data: "데이터b", garbage: "2" }, "title b", "/b");
});

document.querySelector("#c").addEventListener("click", function () {
  history.pushState({ data: "데이터c", garbage: "3" }, "title c", "/c");
});

document.querySelector("#a_aa").addEventListener("click", function () {
  history.pushState(
    { data: "데이터a_aa", garbage: "4" },
    "title a_aa",
    "/a/aa"
  );
});

document.querySelector("#b_bb").addEventListener("click", function () {
  history.pushState(
    { data: "데이터b_bb", garbage: "5" },
    "title b_bb",
    "/b/bb"
  );
});

document.querySelector("#a_aa_3").addEventListener("click", function () {
  history.pushState(
    { data: "데이터a_aa_3", garbage: "6" },
    "title a_aa_3",
    "/a/aa/3"
  );
});

document.querySelector("#re").addEventListener("click", function () {
  history.pushState({ data: "replace", garbage: "7" }, "title replace", "/re");
});

// 뒤로 가기
window.addEventListener("popstate", function () {
  console.log("popstate", history.state);
});
```

- 라우팅 구현하기

1. `index.js`

```javascript
import App from "./app.js";

const config = {
  el: "#root",
};

// app.js에 있는 App class로 인스턴스를 생성
// setup은 config 내부에 요소를 집어넣을 수 있게 하는 메서드 (렌더링)
new App(config).setup();
```

2. `app.js`

```javascript
// 각 페이지 요소들 불러오기
import { ProductPage, ProductDetail } from "./pages/index.js";
// 라우터 인스턴스
import { Router } from "./utils/index.js";

export default class App {
  constructor(props) {
    this.props = props;
  }

  setup() {
    // index.js config의 el 프로퍼티
    const { el } = this.props;

    // 라우터 인스턴스
    const router = new Router({
      "/": ProductPage,
      "/detail": ProductDetail,
    });

    // root 안에 el이 들어갈 수 있도록 해주는 Router class의 메서드
    router.init(el);
  }
}
```

3. `utils/index.js`

```javascript
export { default as Router } from "./router.js";
```

4. `utils/router.js`

```javascript
export default class Router {
  constructor(routes) {
    if (!routes) {
      console.error("Can not initialize routes, need routes!");
    }
    this.routes = routes;
  }

  init(rootElementId) {
    if (!rootElementId) {
      console.error("Can not initialize Route, not define rootElementId");
      return null;
    }
    this.rootElementId = rootElementId;

    // window.location.pathname -> 라우팅 되는 부분 / 이후
    this.routing(window.location.pathname);

    window.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "a") {
        e.preventDefault();
        this.routePush(e.target.href);
      }
    });

    // 뒤로 가기
    window.onpopstate = () => this.routing(window.location.pathname);
  }

  routePush(pathname) {
    window.history.pushState({}, null, pathname);
    this.routing(window.location.pathname);
  }

  routing(pathname) {
    const [_, routeName, ...param] = pathname.split("/");
    let page = "";

    if (this.routes[pathname]) {
      const component = new this.routes[pathname]();
      // component의 render 메서드
      page = component.render();
    }
    if (page) {
      // Router의 render 메서드
      this.render(page);
    }
  }

  render(page) {
    const rootElement = document.querySelector(this.rootElementId);
    rootElement.innerHTML = "";
    rootElement.appendChild(page);
  }
}
```

### 1.1 URL 파라미터 처리
