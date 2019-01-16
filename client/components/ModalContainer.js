import React from "react";
import { connect } from "react-redux";

/** Modal Components */
import CollaborationProposalModal from "../scenes/collaborations/components/CollaborationProposalModal";
import { EditCommentModal } from "../scenes/document/scenes/Document/components";
import { ProjectEditorModal } from "../scenes/project/components";
import FeedbackModal from "./FeedbackModal";
import DependentSelectWidgetCreateModal from "../scenes/wizard/components/widgets/DependentSelectWidgetCreateModal";
import ConfirmationModal from "../scenes/wizard/components/ConfirmationModal";
import WizardDocumentPreviewModal from "../scenes/wizard/components/WizardDocumentPreviewModal";
import CropImageModal from "./CropImageModal";

/** Modal Type Constants **/
const MODAL_COMPONENTS = {
  COLLABORATION_PROPOSAL_MODAL: CollaborationProposalModal,
  EDIT_COMMENT_MODAL: EditCommentModal,
  PROJECT_EDITORS_MODAL: ProjectEditorModal,
  FEEDBACK_MODAL: FeedbackModal,
  LOAD_SELECT_CREATABLE_MODAL: DependentSelectWidgetCreateModal,
  CONFIRMATION_MODAL: ConfirmationModal,
  WIZARD_DOCUMENT_PREVIEW_MODAL: WizardDocumentPreviewModal,
  CROP_IMAGE_MODAL: CropImageModal
};

const styles = {
  FEEDBACK_MODAL: { height: "220px" }
};

const ModalContainer = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[modalType];

  return <SpecificModal style={styles[modalType]} {...modalProps} />;
};

export default connect(state => state.data.modal)(ModalContainer);
