import type { FormEvent } from 'react'
import './Footer.css'

const quickLinks = ['About Us', 'Destinations', 'Packages', 'Blog', 'Contact']
const utilityLinks = [
  'Help Center',
  'Style Guide',
  'Travel Policy',
  'Booking Terms',
  'More Templates',
]
const socialLinks = ['Instagram', 'Facebook', 'YouTube']

export function Footer() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-hero">
          <h2>
            Let's design a tour
            <span>that's truly yours</span>
          </h2>

          <form className="footer-subscribe" onSubmit={handleSubmit}>
            <label htmlFor="footer-email">Subscribe to our newsletter</label>
            <div>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit">Subscribe</button>
            </div>
          </form>
        </div>

        <div className="footer-links">
          <div className="footer-contact">
            <a href="mailto:support@travelviet.com">support@travelviet.com</a>
            <a href="tel:+0883459876">+088-345-9876</a>
          </div>

          <nav aria-label="Footer quick links">
            <h3>Quick links</h3>
            {quickLinks.map((item) => (
              <a href="#home" key={item}>
                {item}
              </a>
            ))}
          </nav>

          <nav aria-label="Footer utility links">
            <h3>Utility</h3>
            {utilityLinks.map((item) => (
              <a href="#home" key={item}>
                {item}
              </a>
            ))}
          </nav>

          <nav aria-label="Social links">
            <h3>Follow us on</h3>
            <div className="footer-social-row">
              {socialLinks.map((item) => (
                <a href="#home" key={item}>
                  {item}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <a className="footer-brand" href="#home" aria-label="TravelViet">
            <span className="footer-brand-mark"></span>
            TravelViet
          </a>
          <p>Copyright © TravelViet - Made for curated travel experiences</p>
        </div>
      </div>
    </footer>
  )
}
