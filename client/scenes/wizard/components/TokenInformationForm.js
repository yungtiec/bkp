import React from "react";
import axios from "axios";
import { Async } from "react-select";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { postDocumentForProject } from "../data/services";
import { getCurrentProject, getCurrentDocument } from "../data/reducer";
import { updateCurrentProject, submitDocumentMetadata } from "../data/actions";

class TokenInformationForm extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      pristine: true
    };
  }

  componentDidMount() {
    this.setState({
      project: this.props.project,
      description: this.props.document ? this.props.document.description : ""
    });
  }

  loadOptions(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return axios.get("/api/projects/search?q=" + input).then(res => {
      return { options: res.data.map(p => ({ value: p, label: p.name })) };
    });
  }

  selectOnChange(option) {
    this.setState({
      pristine: false,
      project: option
    });
  }

  handleDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  next() {
    // form validation
    this.setState({
      pristine: false
    });
    if (!this.state.project) return;
    this.props.submitDocumentMetadata({
      title: `${this.state.project.value.name} (${
        this.state.project.value.symbol
      }) transparency scorecard`,
      project: this.state.project.value,
      description: this.state.description
    });
    this.props.next();
  }

  render() {
    return (
      <div>
        <div class="form-group row">
          <label for="project" class="col-sm-2 col-form-label">
            project
          </label>
          <div class="col-sm-10 d-flex flex-column">
            <Async
              name="form-field-name"
              loadOptions={this.loadOptions}
              onChange={this.selectOnChange}
              value={this.state.project}
            />
            {!this.state.pristine &&
              !this.state.project && (
                <p className="text-danger">this is required</p>
              )}
          </div>
        </div>
        <div class="form-group row">
          <label for="description" class="col-sm-2 col-form-label">
            description
          </label>
          <div class="col-sm-10">
            <input
              type="text"
              class="form-control"
              placeholder="optional short summary"
              onChange={this.handleDescriptionChange}
              value={this.state.description}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={this.props.back}
          >
            back
          </button>
          <button
            type="button"
            className="btn btn-primary ml-2"
            onClick={this.next}
          >
            next
          </button>
        </div>
      </div>
    );
  }
}

const mapStates = (state, ownProps) => ({
  ...ownProps,
  project: getCurrentProject(state),
  document: getCurrentDocument(state)
});

const mapDispatch = (dispatch, ownProps) => ({
  submitDocumentMetadata: ({ project, description, title }) =>
    dispatch(submitDocumentMetadata({ project, description, title }))
});

export default connect(
  mapStates,
  mapDispatch
)(TokenInformationForm);
