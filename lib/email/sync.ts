'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface EmailMessage {
  id: string
  threadId: string
  from: string
  to: string[]
  cc: string[]
  subject: string
  bodyText: string
  bodyHtml: string
  receivedAt: Date
}

export async function syncGmailEmails(userId: string, accessToken: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore
          }
        },
      },
    }
  )

  try {
    // Fetch inbox messages from Gmail API
    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?q=in:inbox&maxResults=10',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Gmail messages')
    }

    const data = await response.json()
    const messages = data.messages || []

    // Fetch full message details and store in database
    for (const msg of messages) {
      const msgResponse = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!msgResponse.ok) continue

      const msgData = await msgResponse.json()
      const headers = msgData.payload?.headers || []

      const getHeader = (name: string) => {
        const header = headers.find((h: any) => h.name === name)
        return header?.value || ''
      }

      const email: EmailMessage = {
        id: msg.id,
        threadId: msgData.threadId,
        from: getHeader('From'),
        to: getHeader('To').split(',').map((s: string) => s.trim()),
        cc: getHeader('Cc').split(',').map((s: string) => s.trim()).filter((s: string) => s),
        subject: getHeader('Subject'),
        bodyText: msgData.payload?.parts?.[0]?.body?.data || '',
        bodyHtml: msgData.payload?.parts?.[1]?.body?.data || '',
        receivedAt: new Date(parseInt(msgData.internalDate)),
      }

      // Store in Supabase
      const { error } = await supabase
        .from('emails')
        .upsert({
          email_account_id: userId, // In production, get actual account ID
          message_id: email.id,
          thread_id: email.threadId,
          from_address: email.from,
          to_addresses: email.to,
          cc_addresses: email.cc,
          subject: email.subject,
          body_text: email.bodyText,
          body_html: email.bodyHtml,
          received_at: email.receivedAt.toISOString(),
        }, {
          onConflict: 'email_account_id,message_id',
        })

      if (error) {
        console.error('Failed to store email:', error)
      }
    }

    return {
      success: true,
      messagesCount: messages.length,
    }
  } catch (error) {
    console.error('Gmail sync error:', error)
    throw error
  }
}

export async function syncOutlookEmails(userId: string, accessToken: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore
          }
        },
      },
    }
  )

  try {
    // Fetch inbox messages from Microsoft Graph API
    const response = await fetch(
      'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=10',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Outlook messages')
    }

    const data = await response.json()
    const messages = data.value || []

    // Store each message in Supabase
    for (const msg of messages) {
      const { error } = await supabase
        .from('emails')
        .upsert({
          email_account_id: userId, // In production, get actual account ID
          message_id: msg.id,
          thread_id: msg.conversationId,
          from_address: msg.from?.emailAddress?.address || '',
          to_addresses: msg.toRecipients?.map((r: any) => r.emailAddress?.address) || [],
          cc_addresses: msg.ccRecipients?.map((r: any) => r.emailAddress?.address) || [],
          subject: msg.subject,
          body_text: msg.bodyPreview,
          body_html: msg.body?.content || '',
          received_at: msg.receivedDateTime,
        }, {
          onConflict: 'email_account_id,message_id',
        })

      if (error) {
        console.error('Failed to store email:', error)
      }
    }

    return {
      success: true,
      messagesCount: messages.length,
    }
  } catch (error) {
    console.error('Outlook sync error:', error)
    throw error
  }
}
