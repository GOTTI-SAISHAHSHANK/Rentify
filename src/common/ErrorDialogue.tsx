import { useEffect, useState } from "react";
import '../styles/pages_css/Dialogue.css';

interface ErrorDialogueProps {
  open: boolean;
  message: string;
  title?: string;
  onClose?: () => void;
}

function ErrorDialogue({ open, message, title = "Error", onClose }: ErrorDialogueProps) {
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
      <div className="modal-confirm-box" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, color: '#c62828' }}>{title}</h3>
        <p>{message}</p>
        <div className="modal-confirm-actions">
          <button className="btn-cancel" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorDialogue;