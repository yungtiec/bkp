import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { InputGrid } from "../../components";
import Formsy from "formsy-react";

const ProfileInput = ({ type, label, name, ...props }) => {
  const Input = FORMSY_INPUT_TYPE[type];
  return (
    <Fragment>
      <div className="mb-4 px-2 w-25 d-inline-block user-settings__input-label">
        <div className="mt-2">
          <label>{label}</label>
        </div>
      </div>
      <div className="mb-4 px-2 w-75 d-inline-block user-settings__input">
        <Input name={name} {...props} />
      </div>
    </Fragment>
  );
};

const EditProfile = ({ match, profile, updateProfile }) => {
  return (
    <div className="user-settings__edit-profile w-100 mt-5">
      <Formsy
        className="user-profile__form"
        onValidSubmit={updateProfile}
        name="user-profile"
        onValid={() => {}}
        onInvalid={() => {}}
      >
        <div className=" d-flex w-100">
          <div className="w-50 pr-4">
            <InputGrid
              type="input"
              label="Name"
              name="name"
              value={profile.name}
              required
            />
            <InputGrid
              type="textarea"
              label="Self Introduction"
              name="self_introduction"
              value={profile.self_introduction}
            />
            <InputGrid
              type="input"
              label="Organization"
              name="organization"
              value={profile.organization}
            />
            <InputGrid
              type="asyncSelect"
              label="Location"
              name="location"
              value={(profile.location || []).map(
                tag =>
                  "id" in tag
                    ? {
                        value: tag.id,
                        label: tag.display_name
                      }
                    : tag
              )}
              multi={true}
              loadOptions={input => {
                return axios
                  .get("/api/tags/search?q=" + input + "&type=location")
                  .then(res => {
                    if (!input || input.length < 3) {
                      return Promise.resolve({ options: [] });
                    }
                    return {
                      options: res.data.map(tag => ({
                        value: tag.id,
                        label: tag.display_name
                      }))
                    };
                  });
              }}
            />
            <InputGrid
              type="asyncSelect"
              label="Role"
              name="careerRole"
              value={(profile.careerRole || []).map(
                tag =>
                  "id" in tag
                    ? {
                        value: tag.id,
                        label: tag.display_name
                      }
                    : tag
              )}
              multi={true}
              loadOptions={input => {
                return axios
                  .get("/api/tags/search?q=" + input + "&type=role")
                  .then(res => {
                    if (!input || input.length < 3) {
                      return Promise.resolve({ options: [] });
                    }
                    return {
                      options: res.data.map(tag => ({
                        value: tag.id,
                        label: tag.display_name
                      }))
                    };
                  });
              }}
            />
            <InputGrid type="input" label="Role" name="role" />
          </div>
          <div className="w-50 pl-4">
            <InputGrid
              type="input"
              label="LinkedIn"
              name="linkedin_url"
              value={profile.linkedin_url}
              validations="isUrl"
              validationError="Please provide a valid url."
            />
            <InputGrid
              type="input"
              label="Twitter"
              name="twitter_url"
              value={profile.twitter_url}
              validations="isUrl"
              validationError="Please provide a valid url."
            />
            <InputGrid
              type="input"
              label="Github"
              name="github_url"
              value={profile.github_url}
              validations="isUrl"
              validationError="Please provide a valid url."
            />
            <InputGrid
              type="input"
              label="Stack Overflow"
              name="stack-overflow_url"
              value={profile.stackoverflow_url}
              validations="isUrl"
              validationError="Please provide a valid url."
            />
            <InputGrid
              type="input"
              label="Website"
              name="website_url"
              validations="isUrl"
              validationError="Please provide a valid url."
            />
          </div>
        </div>
        <div className="">
          <button className="btn btn-primary" type="submit">
            Save settings
          </button>
        </div>
      </Formsy>
    </div>
  );
};

export default withRouter(EditProfile);
