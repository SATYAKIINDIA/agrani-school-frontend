export default function FormContainer({ children, footerLink }) {
  return (
    <div className="mx-auto w-full max-w-md bg-white shadow-xl rounded-2xl p-6 md:p-8">
      {children}
      {footerLink && (
        <div className="mt-6 text-center">
          {footerLink}
        </div>
      )}
    </div>
  );
}
