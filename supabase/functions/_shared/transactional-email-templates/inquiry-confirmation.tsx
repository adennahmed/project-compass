import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Link, Hr, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = "https://mmuicazqthylbhcnolax.supabase.co/storage/v1/object/public/email-assets/kozai-logo-white.png"

interface InquiryConfirmationProps {
  firstName?: string
}

const InquiryConfirmationEmail = ({ firstName }: InquiryConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We've received your inquiry — Kozai</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <table width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
            <td><Img src={LOGO_URL} alt="Kozai" width="90" height="auto" style={logoImg} /></td>
            <td align="right"><Text style={headerLabel}>INQUIRY CONFIRMATION</Text></td>
          </tr></tbody></table>
        </Section>

        {/* Gold accent line */}
        <Section style={goldLine} />

        {/* Main content */}
        <Section style={content}>
          <Text style={thankYouLabel}>THANK YOU</Text>
          <Heading style={nameHeading}>
            {firstName ? `${firstName},` : 'Hello,'}
          </Heading>
          <Text style={subtitleText}>
            We've received your inquiry.
          </Text>

          <Hr style={divider} />

          <Text style={bodyText}>
            A member of our team will be reviewing your submission and will be in touch.
            We appreciate your interest in working with Kozai.
          </Text>

          <Text style={bodyText}>
            In the meantime, feel free to reply directly to this email if you have any
            additional details to share.
          </Text>

          {/* CTA */}
          <Section style={ctaWrapper}>
            <Link href="https://www.kozai.ca" style={ctaLink}>
              Visit Kozai →
            </Link>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <table width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
            <td><Text style={footerLeft}>© 2026 KOZAI</Text></td>
            <td align="right"><Text style={footerRight}>STRATEGY · SYSTEMS · SCALE</Text></td>
          </tr></tbody></table>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InquiryConfirmationEmail,
  subject: "We've received your inquiry — Kozai",
  displayName: 'Inquiry confirmation',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#ffffff', fontFamily: "'Helvetica Neue', Arial, sans-serif" }
const container = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#080808' }
const header = { padding: '32px 40px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const logoImg = { display: 'block' as const }
const headerLabel = { fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', margin: '0' }
const goldLine = { height: '2px', background: 'linear-gradient(90deg, #C8A96E 0%, rgba(200,169,110,0.2) 100%)' }
const content = { padding: '48px 40px 40px' }
const thankYouLabel = { fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#C8A96E', margin: '0 0 24px' }
const nameHeading = { fontSize: '28px', fontWeight: '700' as const, color: '#ffffff', margin: '0 0 8px', textTransform: 'uppercase' as const, lineHeight: '1.15' }
const subtitleText = { fontSize: '28px', fontWeight: '300' as const, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px', textTransform: 'uppercase' as const, lineHeight: '1.15' }
const divider = { width: '60px', height: '1px', backgroundColor: 'rgba(255,255,255,0.12)', margin: '0 0 32px', border: 'none' }
const bodyText = { fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.8', margin: '0 0 24px' }
const ctaWrapper = { display: 'inline-block' as const, border: '1px solid rgba(200,169,110,0.3)', padding: '12px 28px', marginTop: '16px' }
const ctaLink = { fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#C8A96E', textDecoration: 'none' }
const footer = { padding: '24px 40px 32px', borderTop: '1px solid rgba(255,255,255,0.07)' }
const footerLeft = { fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.2)', margin: '0' }
const footerRight = { fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.15)', margin: '0' }
