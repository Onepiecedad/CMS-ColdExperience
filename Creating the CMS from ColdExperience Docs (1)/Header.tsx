import { Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { APP_LOGO, APP_TITLE } from '@/const';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <span className="font-bold text-lg">{APP_TITLE}</span>
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/">
            <a className="text-sm font-medium hover:text-accent transition-colors">
              {t('common.home')}
            </a>
          </Link>
          <Link href="/experiences">
            <a className="text-sm font-medium hover:text-accent transition-colors">
              {t('common.experiences')}
            </a>
          </Link>
          <Link href="/faq">
            <a className="text-sm font-medium hover:text-accent transition-colors">
              {t('common.faq')}
            </a>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/admin">
            <a>
              <Button variant="outline" size="sm">
                {t('common.contact')}
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
