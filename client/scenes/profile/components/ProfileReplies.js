import "./ProfileReplies.scss";
import React from "react";
import { Link } from "react-router-dom";
import { groupBy, keys, isEmpty } from "lodash";
import moment from "moment";
import { ProjectSymbolBlueBox, AnnotationReply } from "../../../components";
import history from "../../../history";
import Avatar from "react-avatar";

export default props => {
  const groupByUri = groupBy(props.replies, "uri");
  if (isEmpty(groupByUri))
    return (
      <p class="profile-subroute__empty">You haven't replied to anyone yet</p>
    );
  return (
    <div className="profile-subroute">
      {keys(groupByUri).map(uri => {
        const annotations = groupByUri[uri];
        const projectSymbol = uri.substring(22).split("/")[1];
        const path = uri.replace(window.location.origin, "");
        return (
          <div className="profile-annotation__uri">
            <ProjectSymbolBlueBox name={projectSymbol} />
            {annotations.map(annotation => (
              <AnnotationReply annotation={annotation} path={path}>
                <a
                  className="see-in-context"
                  onClick={() =>
                    history.push(
                      `${path}/question/${
                        annotation.survey_question_id
                      }/annotation/${
                        annotation.ancestors.filter(a => !a.parendId)[0].id
                      }`
                    )
                  }
                >
                  {annotation.reviewed !== "spam" && "see in context"}
                </a>
              </AnnotationReply>
            ))}
          </div>
        );
      })}
    </div>
  );
};
