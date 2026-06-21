/**
 * Card Component
 * 
 * A reusable card container with multiple variants and sizes.
 * Supports optional header and footer sections.
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" size="md" header={<h2>Title</h2>} footer={<Button>Action</Button>}>
 *   Card content
 * </Card>
 * ```
 */
type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';
type CardSize = 'sm' | 'md' | 'lg';

interface CardProps {
  variant?: CardVariant;
  size?: CardSize;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white shadow-lg rounded-xl',
  elevated: 'bg-white shadow-2xl rounded-2xl',
  outlined: 'bg-white border-2 border-gray-200 rounded-xl',
  flat: 'bg-gray-50 rounded-xl',
};

const sizeStyles: Record<CardSize, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  footer,
  header,
}: CardProps) {
  return (
    <div className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {header && <div className="mb-4">{header}</div>}
      {children}
      {footer && <div className="mt-6 pt-4 border-t border-gray-200">{footer}</div>}
    </div>
  );
}
