import "./Header.scss";
import React from "react";

const Header = () => (
  <div className="landing__header">
    <div className="landing__header-bkp">
      <img src="/assets/the-brooklyn-project-logo-border.png" />
    </div>
    <div className="landing-header__title">
      <p className="landing-header__title--line-one">Get connected to the right people.</p>
      <p className="landing-header__title--line-two">Just ask Olmo.</p>
    </div>
    <div className="landing-header__description">
      Access to opportunities for career advancement and professional growth relies heavily on
      connections.
    </div>
    <div className="landing-header__call-to-action">
      <button type="submit" className="btn">
        Call to action
      </button>
    </div>
    <div className="landing-header__background">
      <img src="/assets/bkp-landing.png" />
    </div>
  </div>
);

export default Header;
