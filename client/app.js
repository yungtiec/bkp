import React, { Component } from "react";
import { Navbar, ModalContainer, Scrollbar } from "./components";
import Routes from "./routes";
import NotificationsSystem from "reapop";
import theme from "reapop-theme-wybo";
import history from "./history";
import ReactGA from "react-ga";
import { Helmet } from 'react-helmet';
const isProduction = process.env.NODE_ENV === "production";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isProduction) {
      window.addEventListener("load", function(){
        window.cookieconsent.initialise({
          "palette": {
            "popup": {
              "background": "#edeff5",
              "text": "#838391"
            },
            "button": {
              "background": "#4b81e8"
            }
          },
          "position": "bottom-right",
          "type": "opt-in",
          "onInitialise": function (status) {
            const type = this.options.type;
            const didConsent = this.hasConsented();
            if (type == 'opt-in' && didConsent) {
              ReactGA.initialize("UA-119328185-1", {
                titleCase: false
              });
              history.listen((location, action) => {
                ReactGA.set({ page: location.pathname });
                ReactGA.pageview(location.pathname);
              });
            }
          },
          "onStatusChange": function(status, chosenBefore) {
            var type = this.options.type;
            var didConsent = this.hasConsented();
            if (type == 'opt-in' && didConsent) {
              ReactGA.initialize("UA-119328185-1", {
                titleCase: false
              });
              history.listen((location, action) => {
                ReactGA.set({ page: location.pathname });
                ReactGA.pageview(location.pathname);
              });
            }
          },
        })
      });
    }
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>The Brooklyn Project</title>
        </Helmet>
        <Routes />
        <ModalContainer />
        <NotificationsSystem theme={theme} />
      </div>
    );
  }
}

export default App;
