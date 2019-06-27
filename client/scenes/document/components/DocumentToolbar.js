import React, { Component } from "react";
import autoBind from "react-autobind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { notify } from "reapop";
import { connect } from "react-redux";
import download from "downloadjs";
import history from "../../../history";
import { orderBy, find, isEmpty, maxBy } from "lodash";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import { loadModal } from "../../../data/reducer";
import policies from "../../../policies.js";
import ReactTooltip from "react-tooltip";
import { animateScroll as scroll} from "react-scroll";
import { currentUserIsAdmin } from '../../../data/user/reducer';
import animateScrollTo from 'animated-scroll-to';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfMake from "html-to-pdfmake";
import moment from 'moment';

class DocumentToolbar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  generatePDF = function (){
    const documentMetadata = this.props.documentMetadata;
    var content = document.getElementsByClassName('markdown-body');
    let summary = document.getElementsByClassName('document-summary');
    let title = document.getElementsByClassName('document__title');
    let authorHeader = `<p>By ${documentMetadata.creator.displayName} | ${moment(documentMetadata.createdAt).format("LL")}`;
    let definitionContent = [
      htmlToPdfMake(title[0].innerHTML),
      htmlToPdfMake(authorHeader)
    ];
    let contentBody;

    if (content.length > 1) {
      summary = summary[0].outerHTML;
      contentBody = content[1].innerHTML;
      definitionContent = definitionContent.concat([
        htmlToPdfMake(summary),
        htmlToPdfMake(contentBody)
      ]);
    } else {
      contentBody = content[0].innerHTML;
      definitionContent = definitionContent.concat([
        htmlToPdfMake(contentBody)
      ]);
    }
    console.log(definitionContent);
    definitionContent[0] = {
      text: definitionContent[0],
      style: ['title']
    };

    definitionContent[1] = {
      text: definitionContent[1],
      style: ['author-header']
    };


    var docDefinition = {
      content: definitionContent,
      styles:{
        'html-div' : {
          background: '#ecece8',
          padding: 10
        },
        'title' : {
          fontSize: 20,
          lineHeight: 1,
          marginBottom: 10,
          bold: true
        },
        'author-header': {
          marginBottom: 10
        },
        'html-b': {
          bold:true,
          fontSize: 18,
        },
        'html-strong': {bold:true},
        'html-u': {decoration:'underline'},
        'html-em': {italics:true},
        'html-i': {italics:true},
        'html-h1': {fontSize:24, bold:true, marginBottom:5},
        'html-h2': {fontSize:15, bold:true, marginBottom:5},
        'html-h3': {fontSize:15, bold:true, marginBottom:5, marginTop:10},
        'html-h4': {fontSize:15, bold:true, marginBottom:5},
        'html-h5': {fontSize:15, bold:true, marginBottom:5},
        'html-h6': {fontSize:14, bold:true, marginBottom:5},
        'html-a': {color:'blue', decoration:'underline'},
        'html-strike': {decoration: 'lineThrough'},
        'html-p': {margin:[0, 5, 0, 10]},
        'html-ul': {marginBottom:5},
        'html-li': {marginLeft:5},
        'html-table': {marginBottom:5},
        'html-th': {bold:true, fillColor:'#EEEEEE'}
      },
      defaultStyle: {
        lineHeight: 1.78,
        fontSize: 12
      }
    };
    console.log(docDefinition);
    pdfMake.createPdf(docDefinition).open();
  }

  render() {
    const {
      documentMetadata,
      uploadMode,
      user,
      upvoteDocument,
      downvoteDocument,
      displayEditor,
      isLoggedIn,
      hideEditor,
      showEditor,
      userId,
      isUserAdmin,
      toggleSidebar,
      sidebarOpen,
      toggleSidebarContext,
      sidebarContext
    } = this.props;

    const doc = documentMetadata;

    const hasUpvoted = !!find(
      documentMetadata.upvotesFrom,
      upvotedUser => upvotedUser.id === user.id
    );

    const hasDownvoted = !!find(
      documentMetadata.downvotesFrom,
      downvotedUser => downvotedUser.id === user.id
    );

    const isOwnDocument = userId === documentMetadata.creator_id || isUserAdmin;

    const toggleSidebarWithContext = (context) => {
      if (!sidebarOpen) {
        toggleSidebar(context)
      }
      if (sidebarOpen && (sidebarContext !== context)) {
        toggleSidebarContext()
      }
      if (sidebarOpen && (sidebarContext === context)) {
        toggleSidebar(context)
      }
    };

    return (
      <div className="mb-2">
        <div className="btn-group mb-3" role="group" aria-label="Basic example">
          <button
            type="button"
            className={`btn document-toolbar__btn ${
              hasUpvoted
                ? "bg-consensys text-light"
                : "text-consensys btn-outline-primary"
            } project-document__upvote-btn`}
            onClick={() =>
              upvoteDocument({
                projectSymbol: documentMetadata.project.symbol,
                documentId: documentMetadata.id,
                versionId: doc.id,
                hasUpvoted,
                hasDownvoted
              })
            }
          >
            <i className="fas fa-thumbs-up mr-2" />
            {documentMetadata.upvotesFrom
              ? documentMetadata.upvotesFrom.length
              : 0}
          </button>
          <button
            type="button"
            className={`btn document-toolbar__btn ${
              hasDownvoted
                ? "bg-consensys text-light"
                : "text-consensys btn-outline-primary"
            }`}
            onClick={() =>
              downvoteDocument({
                projectSymbol: documentMetadata.project.symbol,
                documentId: documentMetadata.id,
                versionId: doc.id,
                hasUpvoted,
                hasDownvoted
              })
            }
          >
            <i className="fas fa-thumbs-down mr-2" />
            {documentMetadata.downvotesFrom
              ? documentMetadata.downvotesFrom.length
              : 0}
          </button>
          {
            this.props.documentMetadata.has_annotator ?
            <button
              type="button"
              className="btn document-toolbar__btn text-consensys btn-outline-primary"
              onClick={() => toggleSidebarWithContext('tableOfContents')}
            >
              <i className="fas fa-list" />
            </button>
            : null
          }
          <button
            type="button"
            className="btn document-toolbar__btn text-consensys btn-outline-primary"
            onClick={() => {
              this.props.documentMetadata.has_annotator ?
                toggleSidebarWithContext('comments') :
                animateScrollTo(document.querySelector('.conversation-title'))
            }}
          >
            <i className="fas fa-comment mr-2" />
            {documentMetadata.comments
              ? documentMetadata.comments.length
              : 0}
          </button>
          {/*<button*/}
            {/*type="button"*/}
            {/*className="btn document-toolbar__btn btn-outline-primary"*/}
            {/*onClick={() => this.generatePDF()}>*/}
              {/*View pdf*/}
          {/*</button>*/}
          {!displayEditor && isLoggedIn && isOwnDocument ? (
            <button className="btn btn-outline-primary" onClick={showEditor}>
              edit
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user,
  width: state.data.environment.width,
  isUserAdmin: currentUserIsAdmin(state)
});

export default connect(mapState, { notify, loadModal, currentUserIsAdmin })(DocumentToolbar);
