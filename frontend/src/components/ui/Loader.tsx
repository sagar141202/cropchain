export default function Loader({ size = "md", text }: { size?: "sm" | "md" | "lg"; text?: string }) {
  const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200 border-t-forest-600`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}
