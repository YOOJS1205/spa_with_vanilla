export default class Router {
  constructor(routes) {
    if (!routes) {
      console.error("Can not initialize routes, need routes!");
    }
    this.routes = routes;

    for (const key in routes) {
      const route = routes[key];
      if (key.indexOf(":") > -1) {
        const [_, routeName, param] = key.split("/");
        this.routes["/" + routeName] = route;
        delete this.routes[key];
      }
    }

    console.log(this.routes);
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
      // if (e.target.tagName.toLowerCase() === "a") {
      //   e.preventDefault();
      //   this.routePush(e.target.href);
      // }
      if (e.target.closest("a")) {
        e.preventDefault();
        this.routePush(e.target.closest("a").href);
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
    const [_, routeName, param] = pathname.split("/");
    let page = "";

    if (this.routes[pathname]) {
      const component = new this.routes[pathname]();
      // component의 render 메서드
      page = component.render();
    } else if (param) {
      const component = new this.routes["/" + routeName](param);
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
