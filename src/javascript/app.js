import { ProductPage, ProductDetail } from "./pages/index.js";
import { Router } from "./utils/index.js";

export default class App {
  constructor(props) {
    this.props = props;
  }

  setup() {
    const { el } = this.props;

    // 라우터 인스턴스
    const router = new Router({
      "/": ProductPage,
      "/detail/:id": ProductDetail,
    });

    router.init(el);
  }
}
