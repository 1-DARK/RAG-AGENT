import { useNavigate } from "react-router-dom";

export default function LimitModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop*/}
      <div
        className="absolute inset-0 bg-modal-overlay backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-modal-backdrop border border-border rounded-3xl p-8 mx-4 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Log in or sign up to get smarter responses, upload files and images,
            and more.
          </p>

          <div className="space-y-4 pt-4 ">
            <a onClick={() => navigate("/sign-in")}>
              <button className="w-full h-14 text-lg font-medium rounded-full bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-border/50">
                Log in
              </button>
            </a>
            <a onClick={() => navigate("/sign-up")}>
              <button className="w-full h-14 text-lg font-medium rounded-full border-border/50 bg-transparent hover:bg-secondary/20 text-foreground">
                Sign up for free
              </button>
            </a>
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground underline decoration-2 underline-offset-4 transition-colors duration-200"
            >
              Stay logged out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
