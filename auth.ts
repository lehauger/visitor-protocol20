import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import { db } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'E-post', type: 'email' },
        password: { label: 'Passord', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const demoEmail = process.env.DEMO_ADMIN_EMAIL
        const demoPassword = process.env.DEMO_ADMIN_PASSWORD

        if (credentials.email === demoEmail && credentials.password === demoPassword) {
          // Finn eller opprett demo-admin i DB
          let employee = await db.employee.findUnique({ where: { email: demoEmail } })
          if (!employee) {
            employee = await db.employee.create({
              data: { name: 'Demo Admin', email: demoEmail, role: 'ADMIN' },
            })
          }
          return { id: employee.id, email: employee.email, name: employee.name, role: employee.role }
        }

        const employee = await db.employee.findUnique({ where: { email: String(credentials.email) } })
        if (!employee?.password) return null
        return null
      },
    }),
    // Azure AD aktiveres kun i produksjon
    ...(process.env.AZURE_AD_CLIENT_ID
      ? [
          MicrosoftEntraID({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
