import "./PermissionDenied.scss";
import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../data/reducer";
import $ from "jquery";
import {Helmet} from 'react-helmet';

const PermissionDenied = ({ isLoggedIn, location }) => {
  return (
    <div className="landing">
      <Helmet>
        <title>Login Required | The Brooklyn Project</title>
        <meta name="description"
              content="You need to be logged in to view this article." />
      </Helmet>
      <section className="open-letter" id="open-letter">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  { isLoggedIn ?
                    <p>You don’t have permission to view this article. If you believe this is an error, send us a message at info@thebkp.com.</p> :
                    <p>You need to be logged in to view this article. Click <Link to={{pathname: "/login", state: { lastPath: location.state.lastPath}}}>here</Link> to log in.</p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer id="footer">
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
}

const mapState = state => ({ isLoggedIn: !!state.data.user.id });

const actions = { logout };

export default withRouter(
  connect(
  mapState,
  actions
)(PermissionDenied));
