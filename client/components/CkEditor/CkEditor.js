import React, {Component} from 'react';
import autoBind from "react-autobind";
import CKEditor from "react-ckeditor-component";
import './CkEditor.scss';
import ReactHtmlParser, {processNodes, convertNodeToElement, htmlparser2} from 'react-html-parser';
import annotator from 'annotator';
import {draw, undraw} from '../../annotator/highlight';
import {isEmpty} from 'lodash';
import { withRouter } from "react-router-dom";

class CkEditor extends Component {

  constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
    this.onChange      = this.onChange.bind(this);
    this.contentHtml   = this.props.documentMetadata.content_html;
    this.state         = {
      content : this.props.documentMetadata.content_html || '',
      renderHtml : this.contentHtml && this.contentHtml.length !== 0,
      temporaryHighlight : {}
    };
    autoBind(this);
  }

  async componentDidMount() {
    const self = this;
    if (!this.annotation) {
      console.log('hitting here', this.props);
      const {qna, match, isLoggedIn, tagFilter, versionId} = this.props;
      var app                                              = new annotator.App();
      var pageUri                                          = function () {
        return {
          beforeAnnotationCreated : function (ann) {
            console.log('before annotation created', self);
            var temporaryHighlight = draw(self['content'], ann);
            console.log(temporaryHighlight);
            self.setState({
              temporaryHighlight
            });
            ann.uri = `${window.location.origin}`;
          },
          annotationCreated : function (ann) {
            console.log('created');
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
          doc_id: doc_id
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
    var self                                             = this;
    const { match } = this.props;
    console.log('updating...')
    await self.annotator.annotations.load({
      uri : `${window.location.origin}${match.url}`,
      doc_id: this.props.documentMetadata.id
    });
  }

  updateContent(newContent) {
    this.setState({
      content : newContent
    })
  }

  onChange(evt) {
    var newContent = evt.editor.getData();
    console.log({newContent});
    this.setState({
      content : newContent
    })
  }

  async onButtonPress() {
    const {
            documentMetadata,
            updateContentHTMLBySlug
          } = this.props;
    await updateContentHTMLBySlug(documentMetadata.slug, this.state.content);
    this.setState({
      renderHtml : !this.state.renderHtml
    })
  }

  render() {
    console.log('heeey', this.props)
    const scriptUrl = 'http://localhost:8000/assets/ckeditor/ckeditor.js';
    const {renderHtml, content} = this.state;
    return (
      <div>
        {!renderHtml ? <CKEditor
          activeClass="p10"
          content={content}
          scriptUrl={scriptUrl}
          events={{
            "change" : this.onChange
          }}/> : <div
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
