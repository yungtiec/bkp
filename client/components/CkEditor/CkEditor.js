import React, {Component} from 'react';
import autoBind from "react-autobind";
import CKEditor from "react-ckeditor-component";
import './CkEditor.scss';
import ReactHtmlParser, {processNodes, convertNodeToElement, htmlparser2} from 'react-html-parser';
import annotator from 'annotator';
import {draw, undraw} from '../../annotator/highlight';
import {isEmpty} from 'lodash';
import {withRouter} from "react-router-dom";
import ActiveToggle from '../../scenes/document/scenes/Document/components/ActiveToggle';
import CategorySelect from '../../scenes/document/scenes/Document/components/CategorySelect';

class CkEditor extends Component {

  constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
    this.onChange      = this.onChange.bind(this);
    this.contentHtml   = this.props.documentMetadata.content_html;
    this.state         = {
      content : this.props.documentMetadata.content_html || '',
      status : this.props.documentMetadata.reviewed,
      category : this.props.documentMetadata.category,
      renderHtml : this.contentHtml && this.contentHtml.length !== 0,
      temporaryHighlight : {},
    };
    autoBind(this);
  }

  async componentDidMount() {
    const self = this;
    if (!this.annotation) {
      const {qna, match, isLoggedIn, tagFilter, versionId} = this.props;
      var app                                              = new annotator.App();
      var pageUri                                          = function () {
        return {
          beforeAnnotationCreated : function (ann) {
            var temporaryHighlight = draw(self['content'], ann);
            self.setState({
              temporaryHighlight
            });
            ann.uri = `${window.location.origin}`;
          },
          annotationCreated : function (ann) {
            undraw(self.state.temporaryHighlight);
            self.props.addNewCommentSentFromServer(ann);
          }
        };
      };
      app
        .include(annotator.ui.main, {
          element : this[`content`],
          editorExtensions : [
            annotator.ui.issue.editorExtension,
            annotator.ui.tags.editorExtension.bind(null, {
              class : "annotator__tag-container"
            })
          ]
        })
        .include(annotator.storage.http, {
          prefix : `${
            window.location.origin
            }/api/documents/${this.props.documentMetadata.id}/annotator`,
          urls : {
            create : "/",
            update : "/update/:id",
            destroy : "/delete/:id",
            search : "/"
          }
        })
        .include(pageUri);
      const doc_id = this.props.documentMetadata.id
      await app.start().then(function () {
        app.annotations.load({
          uri : `${window.location.origin}${match.url}`,
          doc_id : doc_id
        });
      });
      this.annotator = app;
      $(".annotator__tag-container").tagsInput({
        autocomplete_url : "/api/tags/autocomplete",
        defaultText : "add tag(s)",
        height : "70px",
        width : "100%",
        interactive : true,
        delimiter : [" "]
      });
      $(".annotator-cancel").click(evt => {
        if (!isEmpty(self.state.temporaryHighlight))
          undraw(self.state.temporaryHighlight);
      });
    }
    if (!this.props.isLoggedIn || this.props.isClosedForComment) {
      $(".annotator-adder").css("display", "none");
      $(".annotator-adder").css("opacity", 0);
      $(".annotator-adder button").css("cursor", "text");
      $(".annotator-adder").css("height", "0px");
    } else {
      $(".annotator-adder").css("display", "block");
      $(".annotator-adder").css("opacity", 1);
      $(".annotator-adder").css("cursor", "pointer");
      $(".annotator-adder").css("height", "inherit");
    }
  }

  async componentDidUpdate() {
    /**
     * guest user cannot annotate
     * let's hide the annotatorjs widget
     */
    if (!this.props.isLoggedIn || this.props.isClosedForComment) {
      $(".annotator-adder").css("display", "none");
      $(".annotator-adder").css("opacity", 0);
      $(".annotator-adder button").css("cursor", "text");
      $(".annotator-adder").css("height", "0px");
    } else {
      $(".annotator-adder").css("display", "block");
      $(".annotator-adder").css("opacity", 1);
      $(".annotator-adder").css("cursor", "pointer");
      $(".annotator-adder").css("height", "inherit");
    }
    var self      = this;
    const {match} = this.props;
    await self.annotator.annotations.load({
      uri : `${window.location.origin}${match.url}`,
      doc_id : this.props.documentMetadata.id
    });
  }

  updateContent(newContent) {
    this.setState({
      content : newContent
    })
  }

  handleStatusChange(status) {
    console.log({status});
    this.setState({
      status: status.value
    })
  }

  handleCategoryChange(category) {
    console.log({category});
    this.setState({
      category: category.value
    })
  }


  onChange(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      content : newContent
    })
  }

  async onButtonPress() {
    const {
      documentMetadata,
      updateContentHTMLBySlug
    } = this.props;
    const { content, status, category } = this.state;

    const propertiesToUpdate = {
      content,
      status,
      category
    };

    console.log(propertiesToUpdate);

    await updateContentHTMLBySlug(documentMetadata.slug, propertiesToUpdate);
    this.setState({
      renderHtml : !this.state.renderHtml
    });
  }

  render() {
    const scriptUrl = `${window.location.origin.toString()}/assets/ckeditor/ckeditor.js`;
    const {renderHtml, content} = this.state;
    const { documentMetadata } = this.props;
    return (
      <div>
        {!renderHtml ? (
          <div>
            <div className="mb-4">
              <ActiveToggle handleStatusChange={this.handleStatusChange} status={this.state.status} />
              <CategorySelect handleCategoryChange={this.handleCategoryChange} category={this.state.category} />
            </div>
            <CKEditor
              activeClass="p10"
              content={content}
              scriptUrl={scriptUrl}
              events={{
                "change" : this.onChange
              }}/>
          </div>) : <div
          className="mb-4"
          ref={el => (this[`content`] = el)}
        >
          <div className="html-content-body">{ReactHtmlParser(content)}</div>
        </div>
        }
        {!renderHtml && this.props.isLoggedIn ? <button onClick={this.onButtonPress}>save</button> :
          null
        }

        {renderHtml && this.props.isLoggedIn ? <button onClick={this.onButtonPress}>edit</button> :
          null
        }
      </div>

    )
  }
}

export default withRouter(CkEditor);
