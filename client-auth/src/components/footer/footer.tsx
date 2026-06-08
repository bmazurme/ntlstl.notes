import { Link } from '@gravity-ui/uikit';

export default function Footer() {
  return (
    <footer className="blog-footer">
      &copy; 2026 — {' '}
      <Link
        href="https://ntlstl.dev/"
        target="_blank"
        view="secondary"
      >
        ntlstl.dev
      </Link>
    </footer>
  );
}
