import "./About.scss";
import React from "react";

export default about => {
  return (
    <div className="profile-subroute container">
      <div className="profile-about__field">
        <span className="profile-about__field-label">Name</span>
        <div className="profile-about__field-value">
          <div className="profile-about__input-container">
            <input
              type="text"
              disabled
              name="firstName"
              value={about.name}
            />
          </div>
        </div>
      </div>
      <div className="profile-about__field">
        <span className="profile-about__field-label">Email</span>

        <div className="profile-about__field-value">
          <div className="profile-about__input-container">
            <input type="text" disabled name="firstName" value={about.email} />
          </div>
        </div>
      </div>
      <div className="profile-about__field">
        <span className="profile-about__field-label">Organization</span>
        <div className="profile-about__field-value">
          <div className="profile-about__input-container">
            <input
              type="text"
              disabled
              name="firstName"
              value={about.organization}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// <div className="profile-about__field">
//   <span className="profile-about__field-label">First Name</span>
//   <div className="profile-about__field-value">
//     <div className="profile-about__input-container">
//       <input
//         type="text"
//         disabled
//         name="firstName"
//         value={about.first_name}
//       />
//     </div>
//   </div>
// </div>
// <div className="profile-about__field">
//   <span className="profile-about__field-label">Last Name</span>
//   <div className="profile-about__field-value">
//     <div className="profile-about__input-container">
//       <input
//         type="text"
//         disabled
//         name="firstName"
//         value={about.last_name}
//       />
//     </div>
//   </div>
// </div>
