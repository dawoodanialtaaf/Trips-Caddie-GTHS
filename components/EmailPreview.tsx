import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSend: () => void;
  html: string;
  subject: string;
  recipients: string;
}

export default function EmailPreview({ open, onClose, onSend, html, subject, recipients }: Props) {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Email Preview</h2>

        <p><strong>To:</strong> {recipients}</p>
        <p><strong>Subject:</strong> {subject}</p>

        <div
          style={styles.previewBox}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div style={styles.footer}>
          <button style={styles.cancel} onClick={onClose}>Cancel</button>
          <button style={styles.send} onClick={onSend}>Send Email</button>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999
  },
  modal: {
    background: "#fff",
    padding: "22px",
    width: "650px",
    maxHeight: "85vh",
    overflow: "auto",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)"
  },
  previewBox: {
    border: "1px solid #ddd",
    background: "#fafafa",
    padding: "15px",
    marginTop: "15px",
    marginBottom: "15px"
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },
  cancel: {
    padding: "10px 16px",
    border: "1px solid #aaa",
    background: "#eee",
    cursor: "pointer"
  },
  send: {
    padding: "10px 16px",
    border: "none",
    background: "#0073e6",
    color: "#fff",
    cursor: "pointer"
  }
};