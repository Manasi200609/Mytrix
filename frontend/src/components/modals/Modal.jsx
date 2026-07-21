import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        animation: "modalFadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1100px, 90vw)",
          maxHeight: "88vh",
          background: "#1C1B1A",
          border: "0.5px solid #3A3733",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          animation: "modalScaleUp 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 24px",
            borderBottom: "0.5px solid #3A3733",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "#EEEAE4",
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              border: "none",
              borderRadius: 8,
              background: "#252321",
              color: "#8C8680",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3A3733";
              e.currentTarget.style.color = "#EEEAE4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#252321";
              e.currentTarget.style.color = "#8C8680";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: 24,
            overflowY: "auto",
            maxHeight: "calc(88vh - 78px)",
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}