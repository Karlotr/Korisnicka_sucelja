import Link from 'next/link';

interface FooterProps {
  appName: string;
}

export function Footer({ appName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="block text-sm font-semibold tracking-wide text-neutral-100 mb-4"
            >
              {appName}
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Find your perfect getaway in Dalmatia. Carefully selected stays for
              travelers who value comfort, privacy, and quality.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-neutral-200">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/accommodations"
                  className="text-sm text-neutral-400 hover:text-neutral-200"
                >
                  Browse accommodations
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-neutral-400 hover:text-neutral-200"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="text-sm text-neutral-400 hover:text-neutral-200"
                >
                  Become a host
                </Link>
              </li>
            </ul>
          </div>

          
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6">
          <p className="text-center text-xs text-neutral-500">
            © {currentYear} {appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
