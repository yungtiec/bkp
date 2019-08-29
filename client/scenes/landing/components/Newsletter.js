import "./Newsletter.scss";
import React from "react";

const Newsletter = () => (
  <div className="landing__newsletter d-flex flex-column justify-content-center">
    <div className="landing__title">Stay updated.</div>
    <div className="landing__description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
    <form className="landing-newsletter__signup form-inline justify-content-center">
      <div className="form-group mb-2 mr-2">
        <label className="sr-only">Email</label>
        <input type="text" className="form-control" value="email@example.com" />
      </div>
      <button type="submit" className="btn mb-2">
        subscribe
      </button>
    </form>
  </div>
);

export default Newsletter;
