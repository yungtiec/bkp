import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Select from "react-select";
import { TagField, CKEditor, HeroHeader } from "../../../components";
import { createQuestion } from "../data/actions";
import history from "../../../history";

const fetchRequesters = async me => {
  const users = await axios.get("/api/users/delegated").then(res => res.data);
  return users
    .map(a => ({
      ...a,
      label: `${a.name} (@${a.user_handle})`,
      value: a.id
    }))
    .concat([{ label: "myself", value: me.id }]);
};

const NewQuestion = ({ me, createQuestion }) => {
  const ckeScriptUrl = `${window.location.origin.toString()}/assets/ckeditor/ckeditor.js`;
  const isAdmin =
    me.roles &&
    me.roles.length &&
    me.roles.filter(r => r.name === "admin").length;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [owner, setOwner] = useState({});
  const [delegatedAccounts, setDelegatedAccounts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRequesters(me).then(setDelegatedAccounts);
    setOwner({ label: "myself", value: me.id });
  }, [me]);

  return (
    <div className="app-container">
      <HeroHeader
        title="Requests For Comment"
        subtitle="Join the collaboration on blockchain law, regulation, and policy."
      />
      <button
        className="btn btn-outline-primary mb-5"
        onClick={() => history.push("/requests-for-comment")}
      >
        Back to browse
      </button>
      {isAdmin ? (
        <div className="mb-3">
          Post on behalf of:
          <div>
            <Select
              placeholder="select user"
              options={delegatedAccounts}
              onChange={setOwner}
              value={owner}
              style={{ width: "300px" }}
              menuContainerStyle={{ width: "300px" }}
            />
          </div>
        </div>
      ) : null}
      <div className="mb-3">
        Question:
        <div>
          <input
            name="title"
            class="Select-control"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setError(false);
            }}
          />
        </div>
      </div>
      <div className="mb-3">
        Tags:
        <TagField
          handleOnSelect={selected => {
            selected = selected[0].name
              ? selected[0]
              : { ...selected[0], name: selected[0].value };
            if (
              selectedTags.map(tag => tag.name).indexOf(selected.value) === -1
            ) {
              setSelectedTags(selectedTags.concat(selected));
            }
          }}
          handleRemoveTag={index =>
            setSelectedTags(selectedTags.filter((tag, i) => i !== index))
          }
          selectedTags={selectedTags}
          width="300px"
        />
      </div>
      <div className="mb-3">
        <span className="mb-1">Description:</span>
        <CKEditor
          name="document-summary"
          activeClass="p10"
          content={description}
          scriptUrl={ckeScriptUrl}
          events={{
            change: e => setDescription(e.editor.getData())
          }}
          config={{ id: "cke-question-description" }}
        />
      </div>
      <button
        className="btn btn-primary mb-1"
        onClick={() => {
          if (!title) setError(true);
          else {
            createQuestion({
              title,
              description,
              owner,
              selectedTags
            });
          }
        }}
      >
        Submit
      </button>
      <div className="mb-5 text-danger">{error ? "must have title" : ""}</div>
    </div>
  );
};

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    me: state.data.user
  };
};

const actions = {
  createQuestion
};

export default connect(
  mapState,
  actions
)(NewQuestion);
