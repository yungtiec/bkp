import "@babel/polyfill";
import $ from "jquery";
import "jquery-ui/ui/widgets/autocomplete.js";
import "jquery-ui/themes/base/all.css";
import "github-markdown-css/github-markdown.css";
import "./annotator/jquery.tagsinput.min.js";
import "./annotator/jquery.tagsinput.min.css";
import "normalize.css";
import "react-select/dist/react-select.css";
import "react-accessible-accordion/dist/fancy-example.css";
import "rc-steps/assets/index.css";
import "rc-steps/assets/iconfont.css";
import "bootstrap/dist/css/bootstrap.css";
import "tether/dist/js/tether.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "./index.scss";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import history from "./history";
import store from "./store";
import App from "./app";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("app")
);
