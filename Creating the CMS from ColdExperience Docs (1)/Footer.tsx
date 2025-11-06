import { Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { APP_TITLE } from '@/const';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{APP_TITLE}</h3>
            <p className="text-sm text-muted-foreground">
              {t('home.about.description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('common.experiences')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/experiences">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('experiences.title')}
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('common.faq')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('faq.title')}
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('common.contact')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@coldexperience.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  info@coldexperience.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-6">
              <Link href="/privacy">
                <a className="hover:text-foreground transition-colors">
                  {t('footer.privacy')}
                </a>
              </Link>
              <Link href="/terms">
                <a className="hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
