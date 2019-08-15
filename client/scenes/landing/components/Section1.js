import "./Section1.scss";
import React from "react";

const Section1 = () => (
  <div className="landing__section1">
    <div className="landing-section1__title">
      <p>Get answers and share your expertise.</p>
    </div>
    <div className="card-grid">
      <div className="card-wrap">
        <p>I need help making a decision </p>
      </div>
      <div className="card-wrap">
        <p>I need help with a task </p>
      </div>
      <div className="card-wrap">
        <p>Find a balance between work and life </p>
      </div>
      <div className="card-wrap">
        <p>How to negotiate my salary</p>
      </div>
      <div className="card-wrap">
        <p>How do I prepare for an interview?</p>
      </div>
      <div className="card-wrap">
        <p>I want to get better at my job</p>
      </div>
    </div>
  </div>
);

export default Section1;
