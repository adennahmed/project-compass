import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Link, Hr, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = "https://mmuicazqthylbhcnolax.supabase.co/storage/v1/object/public/email-assets/kozai-logo-white.png"
const NOTIFY_EMAIL = "adenah04@outlook.com"

interface InquiryNotificationProps {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  businessName?: string
  businessType?: string
  role?: string | null
  message?: string
}

const field = (label: string, value?: string | null) => {
  if (!value) return null
  return (
    <tr>
      <td style={fieldLabel}>{label}</td>
      <td style={fieldValue}>{value}</td>
    </tr>
  )
}

const InquiryNotificationEmail = (props: InquiryNotificationProps) => {
  const { firstName = '', lastName = '', email = '', phone, businessName, businessType, role, message } = props
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New inquiry from {firstName} {lastName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <table width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
              <td><Img src={LOGO_URL} alt="Kozai" width="90" height="auto" style={logoImg} /></td>
              <td align="right"><Text style={newInquiryLabel}>NEW INQUIRY</Text></td>
            </tr></tbody></table>
          </Section>

          {/* Gold accent line */}
          <Section style={goldLine} />

          {/* Main content */}
          <Section style={content}>
            <Heading style={nameHeading}>{firstName} {lastName}</Heading>
            <Text style={subText}>submitted an inquiry through the website</Text>

            <Hr style={goldDivider} />

            {/* Details table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, marginBottom: '28px' }}>
              <tbody>
                {field("Name", `${firstName} ${lastName}`)}
                {field("Email", email)}
                {field("Phone", phone)}
                {field("Role", role)}
                {field("Business", businessName)}
                {field("Type", businessType)}
              </tbody>
            </table>

            {/* Message */}
            {message && (
              <Section style={{ marginBottom: '32px' }}>
                <Text style={messageLabelStyle}>Message</Text>
                <Section style={messageBox}>
                  <Text style={messageText}>{message}</Text>
                </Section>
              </Section>
            )}

            {/* Reply CTA */}
            <Section style={ctaWrapper}>
              <Link href={`mailto:${email}`} style={ctaLink}>
                Reply to {firstName} →
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <table width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
              <td><Text style={footerLeft}>© 2026 KOZAI</Text></td>
              <td align="right"><Text style={footerRight}>INQUIRY SYSTEM</Text></td>
            </tr></tbody></table>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: InquiryNotificationEmail,
  subject: (data: Record<string, any>) => `New Inquiry from ${data.firstName || ''} ${data.lastName || ''}`,
  displayName: 'Inquiry notification (admin)',
  to: NOTIFY_EMAIL,
  previewData: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '(555) 123-4567',
    businessName: 'Acme Inc',
    businessType: 'SaaS',
    role: 'FOUNDER',
    message: 'I would like to discuss a potential partnership.',
  },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#ffffff', fontFamily: "'Helvetica Neue', Arial, sans-serif" }
const container = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#080808' }
const header = { padding: '32px 40px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }
const logoImg = { display: 'block' as const }
const newInquiryLabel = { fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#C8A96E', margin: '0' }
const goldLine = { height: '2px', background: 'linear-gradient(90deg, #C8A96E 0%, rgba(200,169,110,0.2) 100%)' }
const content = { padding: '48px 40px 40px' }
const nameHeading = { fontSize: '22px', fontWeight: '700' as const, color: '#ffffff', margin: '0 0 6px', textTransform: 'uppercase' as const, lineHeight: '1.15' }
const subText = { fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 32px' }
const goldDivider = { width: '60px', height: '1px', backgroundColor: 'rgba(200,169,110,0.3)', margin: '0 0 28px', border: 'none' }
const fieldLabel = { padding: '10px 16px 10px 0', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', verticalAlign: 'top' as const, whiteSpace: 'nowrap' as const, borderBottom: '1px solid rgba(255,255,255,0.04)' }
const fieldValue = { padding: '10px 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.04)' }
const messageLabelStyle = { fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', margin: '0 0 12px' }
const messageBox = { padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px' }
const messageText = { fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', margin: '0' }
const ctaWrapper = { display: 'inline-block' as const, border: '1px solid rgba(200,169,110,0.3)', padding: '12px 28px' }
const ctaLink = { fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#C8A96E', textDecoration: 'none' }
const footer = { padding: '24px 40px 32px', borderTop: '1px solid rgba(255,255,255,0.07)' }
const footerLeft = { fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.2)', margin: '0' }
const footerRight = { fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.15)', margin: '0' }
