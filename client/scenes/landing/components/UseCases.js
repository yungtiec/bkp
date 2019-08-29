import "./UseCases.scss";
import React from "react";

const UseCases = () => (
  <div className="flex-column justify-content-center landing__use-cases bounty-grid">
    <div className="bounty-box page-padding--left">
      <div className="landing__title">Get Answers And Share Your Expertise.</div>
      <div className="landing__description">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
        architecto beatae vitae dicta sunt explicabo
      </div>
    </div>
    <div className="bounty__inner-grid">
      <div className="bounty-box--inner box--a" id="box--a">
        <div className="box-content">
          <div className="bounty-action">I need help with a task</div>
        </div>
      </div>
      <div className="bounty-box--inner box--b" id="box--b">
        <div className="box-content">
          <div className="bounty-action">Find a balance between work and life</div>
        </div>
      </div>
      <div className="bounty-box--inner box--c" id="box--c">
        <div className="box-content">
          <div className="bounty-action">I need help making a decision </div>
        </div>
      </div>
      <div className="bounty-box--inner box--d" id="box--d">
        <div className="box-content">
          <div className="bounty-action">I want to get better at my job</div>
        </div>
      </div>
    </div>
  </div>
);

export default UseCases;
