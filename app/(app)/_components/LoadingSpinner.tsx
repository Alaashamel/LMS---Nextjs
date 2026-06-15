"use client";

interface LoadingSpinnerProps {
    text?: string;
    isFullScreen?: boolean;
    size?: "sm" | "md" | "lg";
}

const sizeMap = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
};

export default function LoadingSpinner({
    text,
    isFullScreen = false,
    size = "md",
}: LoadingSpinnerProps) {
    const spinnerClass = `animate-spin rounded-full border-t-transparent border-primary ${sizeMap[size]}`;

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={spinnerClass} />
            {text && (
                <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
            )}
        </div>
    );

    if (isFullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return content;
}
