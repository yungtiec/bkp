import React, { Component } from "react";
import autoBind from "react-autobind";
import CommentBox from "./CommentBox";
import { AsyncCreatable } from "react-select";
import { TagChip } from "../../../../../../components";
import axios from "axios";
import { assignIn } from "lodash";

export default class CommentBoxWithTagField extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      tags: this.props.tags,
      selectedTags: this.props.selectedTags,
      issueOpen: this.props.issueOpen
    };
  }

  handleTagOnChange(selected) {
    selected = selected[0].name
      ? selected[0]
      : { ...selected[0], name: selected[0].value };
    if (
      this.state.selectedTags.map(tag => tag.name).indexOf(selected.value) ===
      -1
    ) {
      this.setState(prevState => ({
        selectedTags: [...prevState.selectedTags, selected]
      }));
    }
  }

  handleIssueCheckboxChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      issueOpen: value
    });
  }

  handleRemoveTag(index) {
    this.setState({
      selectedTags: this.state.selectedTags.filter((tag, i) => i !== index)
    });
  }

  handleSubmitEditedCommentAndTag(argObj) {
    const { onSubmit } = this.props;
    const newArgObj = {
      ...argObj,
      tags: this.state.selectedTags,
      issueOpen: this.state.issueOpen,
      documentId: this.props.documentId
    };
    onSubmit(newArgObj);
    this.setState({
      selectedTags: [],
      issueOpen: false
    });
  }

  async getTags(input, callback) {
    input = input.toLowerCase();
    var tags = await axios
      .get("/api/tags/autocomplete", {
        params: { term: input }
      })
      .then(res => res.data);
    return { options: tags };
  }

  render() {
    const {
      onSubmit,
      tags,
      showTags,
      showIssueCheckbox,
      ...otherProps
    } = this.props;
    return (
      <div>
        {showTags && (
          <div>
            <AsyncCreatable
              multi={true}
              placeholder="add or create tag(s)"
              loadOptions={this.getTags}
              onChange={this.handleTagOnChange}
              value={[]}
            />
            <div className="comment-item__tags mt-2 mb-2">
              {this.state.selectedTags && this.state.selectedTags.length
                ? this.state.selectedTags.map((tag, index) => (
                    <TagChip
                      key={`comment-tag__${tag.name}`}
                      containerClassname="comment-item__tag dark-bg"
                      tagValue={tag.name}
                      closeIconOnClick={() => this.handleRemoveTag(index)}
                    />
                  ))
                : ""}
            </div>
          </div>
        )}
        <CommentBox
          {...otherProps}
          onSubmit={this.handleSubmitEditedCommentAndTag}
        />
      </div>
    );
  }
}
