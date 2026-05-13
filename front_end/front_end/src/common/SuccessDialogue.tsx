import { useEffect, useState } from "react";
import '../styles/pages_css/Dialogue.css';

interface SuccessDialogueProps {
  open: boolean;
  message: string;
  title?: string;
  onClose?: () => void;
}

function SuccessDialogue({ open, message, title = "Success", onClose }: SuccessDialogueProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-confirm-overlay" onClick={handleClose}>
      <div className="modal-confirm-box success-box" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, color: '#2e7d32' }}>{title}</h3>
        <p>{message}</p>
        <div className="modal-confirm-actions">
          <button className="btn btn-primary" onClick={handleClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessDialogue;