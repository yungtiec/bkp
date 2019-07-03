import "./PermissionDenied.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../data/reducer";
import $ from "jquery";
import {Helmet} from 'react-helmet';

const NotFound = ({ user, logout }) => (
  <div className="landing">
    <Helmet>
      <title>Permission Denied | The Brooklyn Project</title>
      <meta name="description"
            content="You need to be logged in to view this article." />
    </Helmet>
    <section className="open-letter" id="open-letter">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <p>
                  You need to be logged in to view this article.
                </p>
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

const mapState = state => ({ user: state.data.user });

const actions = { logout };

export default connect(
  mapState,
  actions
)(NotFound);
