export default function PageLayout({ children, className = '' }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 py-12 ${className}`}>
      {children}
    </div>
  );
}
