import nodemailer from 'nodemailer'

const isDemo = !process.env.SMTP_HOST

function logEmail(to: string, subject: string, text: string) {
  console.log('\n📧 E-POST (demo — sendes ikke):')
  console.log(`  Til: ${to}`)
  console.log(`  Emne: ${subject}`)
  console.log(`  ---`)
  console.log(text)
  console.log('---\n')
}

async function sendMail(to: string, subject: string, text: string, html?: string) {
  if (isDemo) {
    logEmail(to, subject, text)
    return
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text, html })
}

export async function sendCheckinNotification(
  hostEmail: string,
  hostName: string,
  visitorName: string,
  visitorCompany: string | null,
  visitId: string
) {
  const company = visitorCompany ? ` (${visitorCompany})` : ''
  const url = `${process.env.NEXTAUTH_URL}/visits/${visitId}`
  await sendMail(
    hostEmail,
    `${visitorName} har sjekket inn`,
    `Hei ${hostName},\n\n${visitorName}${company} har sjekket inn og venter på deg.\n\nSe loggoppføring: ${url}\n`
  )
}

export async function sendCheckoutLink(
  visitorEmail: string,
  visitorName: string,
  checkoutToken: string
) {
  const url = `${process.env.NEXTAUTH_URL}/checkout/${checkoutToken}`
  await sendMail(
    visitorEmail,
    'Bekreftelse på innsjekk — Besøksprotokoll',
    `Hei ${visitorName},\n\nDu er registrert som besøkende. Klikk lenken nedenfor for å sjekke ut når du forlater bygget:\n\n${url}\n`
  )
}

export async function sendInvitation(
  visitorEmail: string,
  visitorName: string,
  inviteToken: string,
  hostName: string,
  visitDate: string
) {
  const url = `${process.env.NEXTAUTH_URL}/checkin/invite/${inviteToken}`
  await sendMail(
    visitorEmail,
    `Invitasjon til besøk — ${visitDate}`,
    `Hei ${visitorName},\n\n${hostName} har invitert deg til besøk ${visitDate}.\n\nBruk denne lenken for å sjekke inn ved ankomst:\n\n${url}\n`
  )
}
