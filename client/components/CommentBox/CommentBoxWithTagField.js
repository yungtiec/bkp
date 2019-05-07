import React, { Component } from "react";
import PropTypes from "prop-types";
import autoBind from "react-autobind";
import CommentBox from "./CommentBox";
import { TagChip, TagField } from "../index";
import axios from "axios";

export default class CommentBoxWithTagField extends Component {
  static propTypes = {
    className: PropTypes.string,
    selectedTags: PropTypes.arrayOf(PropTypes.object),
    issueOpen: PropTypes.boolean,
    showTags: PropTypes.boolean,
    showIssueCheckbox: PropTypes.boolean,
    initialValue: PropTypes.string,
    documentId: PropTypes.number,
    question: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    notLoggedin: PropTypes.boolean,
    blockSubmitBtn: PropTypes.boolean
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
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
    const newArgObj = {
      ...argObj,
      ...this.props,
      selectedTags: this.state.selectedTags,
      issueOpen: this.state.issueOpen,
      documentId: this.props.documentId
    };
    this.props.onSubmit(newArgObj);
    this.setState({
      selectedTags: [],
      issueOpen: false
    });
  }

  render() {
    const {
      className,
      onSubmit,
      showTags,
      showIssueCheckbox,
      ...otherProps
    } = this.props;

    return (
      <div className={className}>
        {showTags && (
          <TagField
            handleOnSelect={this.handleTagOnChange}
            handleRemoveTag={this.handleRemoveTag}
            selectedTags={this.state.selectedTags}
            disabled={this.props.notLoggedin}
          />
        )}
        <CommentBox
          {...otherProps}
          onSubmit={this.handleSubmitEditedCommentAndTag}
        />
      </div>
    );
  }
}
