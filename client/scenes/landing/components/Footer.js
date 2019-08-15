import "./Footer.scss";
import React from "react";

const Footer = () => (
  <footer className="landing__footer">
    <div className="container d-flex flex-column align-items-center">
      <img src="assets/consensys-logo-white-transparent.png" />
      <div className="mt-5">
        <a
          href="https://tinyurl.com/y94wspyg"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4"
        >
          privacy policy
        </a>
        <a
          href="https://drive.google.com/open?id=1p4F4UVhCohifqb0R5WzfJ8R1nKJOahIV"
          target="_blank"
          rel="noopener noreferrer"
        >
          terms of use
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
