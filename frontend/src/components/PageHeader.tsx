import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description: string;
  showBackButton?: boolean;
}

export default function PageHeader({
  title,
  description,
  showBackButton = true,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {showBackButton && (
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </button>
      )}
      <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
}
