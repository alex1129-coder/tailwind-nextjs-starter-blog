import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const yearDisplay = currentYear <= 2025 ? '2025' : `2025–${currentYear}`

  return (
    <footer className="bg-forest w-full">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10 sm:px-6 xl:px-0">
        <div className="mb-4 flex space-x-4">
          <SocialIcon
            kind="mail"
            href={`mailto:${siteMetadata.email}`}
            size={6}
            iconClassName="text-white hover:text-kraft"
          />
          <SocialIcon
            kind="github"
            href={siteMetadata.github}
            size={6}
            iconClassName="text-white hover:text-kraft"
          />
          <SocialIcon
            kind="facebook"
            href={siteMetadata.facebook}
            size={6}
            iconClassName="text-white hover:text-kraft"
          />
          {/* <SocialIcon
            kind="youtube"
            href={siteMetadata.youtube}
            size={6}
            iconClassName="text-white hover:text-kraft"
          /> */}
          <SocialIcon
            kind="linkedin"
            href={siteMetadata.linkedin}
            size={6}
            iconClassName="text-white hover:text-kraft"
          />
          {/* <SocialIcon
            kind="twitter"
            href={siteMetadata.twitter}
            size={6}
            iconClassName="text-white hover:text-kraft"
          /> */}
          {/* <SocialIcon
            kind="bluesky"
            href={siteMetadata.bluesky}
            size={6}
            iconClassName="text-white hover:text-kraft"
          />
          <SocialIcon
            kind="x"
            href={siteMetadata.x}
            size={6}
            iconClassName="text-white hover:text-kraft"
          /> */}
          <SocialIcon
            kind="instagram"
            href={siteMetadata.instagram}
            size={6}
            iconClassName="text-white hover:text-kraft"
          />
          <SocialIcon
            kind="threads"
            href={siteMetadata.threads}
            size={6}
            iconClassName="text-white hover:text-kraft"
          />
          {/* <SocialIcon
            kind="medium"
            href={siteMetadata.medium}
            size={6}
            iconClassName="text-white hover:text-kraft"
          /> */}
        </div>
        <div className="text-kraft text-sm">© {yearDisplay} guoen.dev · All Rights Reserved.</div>
      </div>
    </footer>
  )
}
