import './NotificationSettings.scss'
import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { keys } from "lodash";
import autoBind from "react-autobind";

class NotificationSettings extends React.Component {
  constructor(props) {
    super(props);
    const notificationConfig = this.props.profile.notification_config || {};
    this.state = {
      new_articles: notificationConfig.new_articles || false,
      upvotes_and_downvotes: notificationConfig.upvotes_and_downvotes|| false,
      comments_and_replies: notificationConfig.comments_and_replies|| false,
      monthly_update: notificationConfig.monthly_update|| false,
    }

    autoBind(this);
  }

  updateNotificationConfigs() {
    const newProfile = Object.assign({}, this.props.profile);
    newProfile.notification_config = this.state;
    return this.props.updateProfile(newProfile);
  }


  render() {
    const { screenWidth } = this.props;

    return (
      <div className="user-settings__edit-account w-100 mt-3">
        <div className=" d-flex w-100 justify-content-center">
          <div className={`notification-panel ${screenWidth > 992 ? "w-50" : "w-100"}`}>
            <div className="notification__fieldset-header">
              <h6 className="font-weight-bold mb-0">Notification Settings</h6>
            </div>
            <h6 className="notification-checkbox">
              <input
                name="comments_and_replies"
                type="checkbox"
                checked={this.state.comments_and_replies}
                onChange={() => this.setState({
                  comments_and_replies: !this.state.comments_and_replies
                })}
              />
              Comments And Replies
            </h6>
            <h6 className="notification-checkbox">
              <input
                name="upvotes_and_downvotes"
                type="checkbox"
                checked={this.state.upvotes_and_downvotes}
                onChange={() => this.setState({
                  upvotes_and_downvotes: !this.state.upvotes_and_downvotes
                })}
              />
              Upvotes And Downvotes
            </h6>
            <h6 className="notification-checkbox">
              <input
                name="new_articles"
                type="checkbox"
                checked={this.state.new_articles}
                onChange={() => this.setState({
                  new_articles: !this.state.new_articles
                })}
              />
              New Articles
            </h6>
            <h6 className="notification-checkbox">
              <input
                name="monthly_update"
                type="checkbox"
                checked={this.state.monthly_update}
                onChange={() => this.setState({
                  monthly_update: !this.state.monthly_update
                })}
              />
              Monthly Update
            </h6>
            <div className="notification-checkbox">
              <button type="submit" className="btn btn-outline-primary" onClick={this.updateNotificationConfigs}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default withRouter(NotificationSettings);
