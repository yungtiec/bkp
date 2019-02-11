import React from "react";

export default ({ icon, stat, label }) => {
  var display = "";
  if (Number.isInteger(stat)) display += stat;
  if (label) display += (Number.isInteger(stat) ? " " : "") + label;
  return (
    <a className="contribution__action-btn">
      <i class={`fas fa-${icon}`} />
      <span>{display}</span>
    </a>
  );
};
