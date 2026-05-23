import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AppleIcon, GitHubIcon, GoogleIcon } from '../icons/SocialIcons'

type Provider = 'google' | 'apple' | 'github'

const providers: { id: Provider; labelKey: string; Icon: typeof GoogleIcon }[] = [
  { id: 'google', labelKey: 'social.google', Icon: GoogleIcon },
  { id: 'apple', labelKey: 'social.apple', Icon: AppleIcon },
  { id: 'github', labelKey: 'social.github', Icon: GitHubIcon },
]

export function SocialAuthButtons() {
  const { t } = useTranslation('auth')

  const handleSocial = (_provider: Provider, label: string) => {
    toast.message(
      String(
        t('socialComingSoon', {
          provider: label,
          defaultValue: `${label} — coming soon`,
        }),
      ),
    )
  }

  return (
    <div className="auth-social">
      <p className="auth-social-divider">
        <span>{t('social.divider')}</span>
      </p>
      <div className="auth-social-grid">
        {providers.map(({ id, labelKey, Icon }) => {
          const label = String(t(labelKey))
          return (
            <button
              key={id}
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocial(id, label)}
              aria-label={label}
            >
              <Icon className="auth-social-icon" />
              <span className="auth-social-label">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
