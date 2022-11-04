import App from "./app.js";

const config = {
  el: "#root",
};

// app.js에 있는 App class로 인스턴스를 생성
// setup은 config 내부에 요소를 집어넣을 수 있게 하는 메서드
new App(config).setup();
