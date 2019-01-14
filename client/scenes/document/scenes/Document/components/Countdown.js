import "./Countdown.scss";
import React from "react";
import ReactDOM from "react-dom";
import { default as ReactCountdown } from "react-countdown-now";
import ReactTooltip from "react-tooltip";

// Random component
const Completionist = () => <span>This document is closed for comment</span>;

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return (
      <div className="comment-item__main">
        <div className="comment-item__header">
          <p className="mb-2" style={{ color: "white" }}>
            Thank you for your feedback. The public comment period is now closed.
            We are finalizing version 1.0, which we will post here in the coming weeks.
          </p>
        </div>
      </div>
    );
  } else {
    // Render a countdown
    return (
      <div>
        <div className="comment-item__main">
          <div className="comment-item__header">
            <p data-tip data-for="countdown-explaination" className="mb-2">
              Time left to leave a comment
              <i class="ml-2 fas fa-question-circle" />
            </p>
            <ReactTooltip id="countdown-explaination" type="light">
              <span>
                Once the countdown ends, you will no longer be able to provide feedback.
              </span>
            </ReactTooltip>
          </div>
        </div>
        <ul className="countdown mb-4">
          <li className="countdown-item">
            <div className="countdown-item__number">{days}</div>
            <div className="countdown-item__label">Days</div>
          </li>
          <li className="countdown-item">
            <div className="countdown-item__number">{hours}</div>
            <div className="countdown-item__label">Hours</div>
          </li>
          <li className="countdown-item">
            <div className="countdown-item__number">{minutes}</div>
            <div className="countdown-item__label">Minutes</div>
          </li>
          <li className="countdown-item">
            <div className="countdown-item__number">{seconds}</div>
            <div className="countdown-item__label">Seconds</div>
          </li>
        </ul>
      </div>
    );
  }
};

export default ({ timeInUnix }) => (
  <ReactCountdown date={timeInUnix} renderer={renderer} />
);
