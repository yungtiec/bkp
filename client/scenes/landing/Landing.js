import "./Landing.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../data/reducer";
import $ from "jquery";

const goToSection = sectionClass => {
  var offset = $(sectionClass).offset();
  offset &&
    $("html, body").animate(
      {
        scrollTop: offset.top
      },
      200
    );
};

const Landing = ({ user, logout }) => (
  <div className="landing">
    <header className="masthead">
      <nav className="navbar navbar-expand-lg navbar-light" id="mainNav">
        <div className="container d-flex justify-content-center mt-5">
          <a
            className="navbar-brand js-scroll-trigger"
            href="https://thebkp.com/"
          />
        </div>
      </nav>
      <div className="container h-fill">
        <div className="row">
          <div className="col-lg-12 my-auto">
            <div className="header-content mx-auto d-flex flex-column justify-content-center align-items-center">
              <img
                className="header-content__hero-img mb-5"
                src="/assets/the-brooklyn-project-logo-white-transparent.png"
              />
              <div className="row">
                <div className="col-lg-12 my-auto">
                  <Link class="btn btn-landing btn-xl" to="/feed">
                    commnunity collaborations
                  </Link>
                  <a
                    class="btn btn-landing btn-xl ml-2"
                    onClick={() => goToSection(".get-involved")}
                  >
                    get involved
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section className="open-letter" id="open-letter">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                <h1 className="py-3">
                  An industry-wide initiative to promote token-powered economic
                  growth and consumer protection.
                </h1>
              </div>
              <div className="col-4" />
            </div>
            <div className="row">
              <div className="col-1" />
              <div className="col-12 col-md-7 col-lg-7 col-xl-7">
                <figure>
                  <blockquote className="py-3">
                    <span>“</span>We are taking this action now, because we, as
                    a company and an industry, have a unique opportunity to
                    restore trust between people and institutions. By acting
                    responsibly today, we can help make sure we are collectively
                    able to reap the benefits of this powerful technology
                    tomorrow.<span>”</span>
                  </blockquote>
                  <figcaption class="source">
                    — Joseph Lubin, Founder of ConsenSys &amp; Ethereum
                    Co-Founder
                  </figcaption>
                </figure>
              </div>
              <div className="col-4" />
            </div>
            <div className="row">
              <div className="col-12">
                <p>
                  Read the{" "}
                  <a
                    href="https://media.consensys.net/announcing-the-brooklyn-project-for-token-launches-22ba89279f5f"
                    target="_blank"
                  >
                    open letter from ConsenSys
                  </a>&nbsp;that launched The Brooklyn Project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="get-involved" id="get-involved">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-8 col-xl-8">
            <h3>Get Involved</h3>
            <h2>Want to join The Brooklyn Project?</h2>
            <p>
              Provide comments, suggestions and feedback on the{" "}
              <a href="http://bit.ly/CFTC-12-2018-RFC" target="_blank">
                CFTC’s December 2018 Request for Input
              </a>.
            </p>
            <p>
              Join other{" "}
              <a href="https://collaborate.thebkp.com" target="_blank">
                Open Collaborations
              </a>.
            </p>
            <p>
              Join the discussion on{" "}
              <a
                href="https://t.me/joinchat/HRhhQEvAeC2t4wiYHquYUg"
                target="_blank"
              >
                Telegram
              </a>.&nbsp;
            </p>
            <p>
              Follow us on Twitter{" "}
              <a href="https://twitter.com/TheBKP_Official" target="_blank">
                @TheBKP_Official
              </a>.
            </p>
            <p>
              <a href="https://goo.gl/forms/PCSi9KEXJ8K2NZtH3" target="_blank">
                Sign up here
              </a>&nbsp;to get involved or stay updated.
            </p>
            <h3> </h3>
            <h3>Resources</h3>
            <ul>
              <li>
                <p>
                  Our open letter announcing{" "}
                  <a
                    href="https://media.consensys.net/announcing-the-brooklyn-project-for-token-launches-22ba89279f5f"
                    target="_blank"
                  >
                    The Brooklyn Project
                  </a>.
                </p>
              </li>
              <li>
                <p>
                  <a
                    href="http://cardozo.yu.edu/sites/default/files/Cardozo%20Blockchain%20Project%20-%20Not%20So%20Fast%20-%20SAFT%20Response_final.pdf"
                    target="_blank"
                  >
                    Not So Fast - Risks Related to the Use of a "SAFT" for Token
                    Sales
                  </a>
                  <br />(A Cardozo Blockchain Project initiative, with support
                  from ConsenSys).
                </p>
              </li>
              <li>
                <p>
                  <a
                    href="https://www.coinbase.com/legal/securities-law-framework.pdf"
                    target="_blank"
                  >
                    A Securities Law Framework for Blockchain Tokens
                  </a>
                  <br />(An initiative of Coinbase, Coin Center, Union Square
                  Ventures and Consensys).
                </p>
              </li>
              <li>
                <p>
                  <a
                    href="https://media.consensys.net/the-brooklyn-project-take-part-in-building-a-consumer-friendly-token-industry-bcb954c8e2ff"
                    target="_blank"
                  >
                    The Brooklyn Project: Take Part in Building a
                    Consumer-Friendly Token Industry
                  </a>
                </p>
              </li>
              <li>
                <p>
                  <a href="https://thebkp.com/token-taxonomy">
                    Digital Asset Taxonomy
                  </a>
                </p>
              </li>
              <li>
                <p>
                  <a href="/crypto-asset-written-evidence">
                    Crypto Asset Written Evidence for UK Parliament - 29 Apr
                    2018
                  </a>
                </p>
              </li>
              <li>
                <p>
                  Announcing The Brooklyn Project’s{" "}
                  <a href="https://framework.thebkp.com" target="_blank">
                    Consumer{" "}
                  </a>
                  <a
                    href="https://media.consensys.net/a-consumer-token-framework-forging-a-path-towards-responsible-token-projects-7630c44538be"
                    target="_blank"
                  >
                    Token
                  </a>
                  <a href="https://framework.thebkp.com" target="_blank">
                    {" "}
                    Framework
                  </a>
                </p>
              </li>
              <li>
                <p>
                  See many other resources on{" "}
                  <a href="https://collaborate.thebkp.com" target="_blank">
                    Open Collaboration Platform
                  </a>.{" "}
                </p>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-4 col-lg-4 col-xl-4" />
        </div>
      </div>
    </section>
    <footer>
      <div className="container d-flex flex-column align-items-center">
        <img src="assets/consensys-logo-white-transparent.png" />
        <div className="mt-5">
          <a
            href="https://tinyurl.com/y94wspyg"
            target="_blank"
            className="mr-4"
          >
            privacy policy
          </a>
          <a
            href="https://drive.google.com/open?id=1p4F4UVhCohifqb0R5WzfJ8R1nKJOahIV"
            target="_blank"
          >
            terms of use
          </a>
        </div>
      </div>
    </footer>
  </div>
);

const mapState = state => ({ user: state.data.user });

const actions = { logout };

export default connect(
  mapState,
  actions
)(Landing);
