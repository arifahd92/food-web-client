import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/utils/routes';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-2xl font-semibold">404 - Page not found</h1>
      <Link to={ROUTES.menu}>
        <Button>{'Back to Menu'}</Button>
      </Link>
    </div>
  );
}
