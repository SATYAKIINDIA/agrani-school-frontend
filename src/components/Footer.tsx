interface FooterProps {
  year?: number;
  companyName?: string;
}

export default function Footer({ year = new Date().getFullYear(), companyName = 'Agrani School ERP' }: FooterProps) {
  return (
    <p className="text-center text-sm text-gray-500 mt-8">
      © {year} {companyName}. All rights reserved.
    </p>
  );
}
