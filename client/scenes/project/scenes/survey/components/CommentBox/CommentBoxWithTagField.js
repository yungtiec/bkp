import React, { Component } from "react";
import autoBind from "react-autobind";
import CommentBox from "./index";
import Select from "react-select";
import { TagChip } from "../../../../../../components";

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

  handleTagCloseIconOnClick(index) {
    this.setState({
      selectedTags: this.state.selectedTags.filter((tag, i) => i !== index)
    });
  }

  handleSubmitEditedCommentAndTag(argObj) {
    const { onSubmit } = this.props;
    const newArgObj = {
      ...argObj,
      tags: this.state.selectedTags,
      issueOpen: this.state.issueOpen
    };
    onSubmit(newArgObj);
    this.setState({
      selectedTags: [],
      issueOpen: false
    })
  }

  render() {
    const { onSubmit, tags, ...otherProps } = this.props;
    return (
      <div>
        <Select.Creatable
          multi={true}
          placeholder="add tag(s)"
          options={this.state.tags.map(tag => ({
            ...tag,
            value: tag.name,
            label: tag.name
          }))}
          onChange={this.handleTagOnChange}
          value={[]}
        />
        <div className="annotation-item__tags mt-2 mb-2">
          {this.state.selectedTags && this.state.selectedTags.length
            ? this.state.selectedTags.map((tag, index) => (
                <TagChip
                  key={`annotation-tag__${tag.name}`}
                  containerClassname="annotation-item__tag"
                  tagValue={tag.name}
                  closeIconOnClick={() => this.handleTagCloseIconOnClick(index)}
                />
              ))
            : ""}
        </div>
        <div className="mt-2 mb-4">
          <p>
            <input
              className="mr-2"
              name="engagement-item__issue-checkbox"
              type="checkbox"
              checked={this.state.issueOpen}
              onChange={this.handleIssueCheckboxChange}
            />
            Open an issue?
          </p>
        </div>
        <CommentBox
          {...otherProps}
          onSubmit={this.handleSubmitEditedCommentAndTag}
        />
      </div>
    );
  }
}
