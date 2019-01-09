import React, {Component} from 'react';
import autoBind from "react-autobind";
import CKEditor from "react-ckeditor-component";
import './CkEditor.scss';
import ReactHtmlParser, {processNodes, convertNodeToElement, htmlparser2} from 'react-html-parser';

class CkEditor extends Component {

  constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
    this.onChange      = this.onChange.bind(this);
    this.contentHtml   = this.props.documentMetadata.content_html;
    this.state         = {
      content : this.props.documentMetadata.content_html || '',
      renderHtml : this.contentHtml && this.contentHtml.length !== 0
    };
    autoBind(this);
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
    const scriptUrl             = 'http://localhost:8000/assets/ckeditor/ckeditor.js';
    const {renderHtml, content} = this.state;
    return (
      <div>
        {!renderHtml ? <CKEditor
          activeClass="p10"
          content={content}
          scriptUrl={scriptUrl}
          events={{
            "change" : this.onChange
          }}/> : <div className="html-content-body">{ReactHtmlParser(content)}</div>
        }
        <button onClick={this.onButtonPress}>click</button>
      </div>

    )
  }
}

export default CkEditor;
