import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { assignIn } from "lodash";
import Select from "react-select";
import { TagField, CKEditor, HeroHeader } from "../../../components";
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

const QuestionEditor = ({ me, question, createQuestion, editQuestion }) => {
  const ckeScriptUrl = `${window.location.origin.toString()}/assets/ckeditor/ckeditor.js`;
  const isAdmin =
    me.roles &&
    me.roles.length &&
    me.roles.filter(r => r.name === "admin").length;

  const [title, setTitle] = useState(question ? question.title : "");
  const [description, setDescription] = useState(
    question ? question.description : ""
  );
  const [selectedTags, setSelectedTags] = useState(
    question
      ? question.tags.map(t =>
          assignIn({ label: t.display_name || t.name, value: t.name }, t)
        )
      : []
  );
  const [owner, setOwner] = useState(
    question
      ? assignIn(
          { label: question.owner.name, value: question.owner.id },
          question.owner
        )
      : {}
  );
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
        onClick={() =>
          history.push(`/requests-for-comment/${question ? question.slug : ""}`)
        }
      >
        Back to {question ? "question" : " browse"}
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
            if (!question)
              createQuestion({
                title,
                description,
                owner,
                selectedTags
              });
            else
              editQuestion({
                title,
                description,
                owner,
                selectedTags,
                question
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

export default QuestionEditor;
