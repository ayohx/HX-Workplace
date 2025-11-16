# Supabase Email Configuration for Development

## ⚠️ Issue: Email Bounces

When creating test users with **fake email addresses**, Supabase attempts to send verification emails, which bounce back and can cause your account to be temporarily restricted.

---

## ✅ Solution: Disable Email Confirmation (Development Mode)

### Step 1: Access Authentication Settings

1. Go to your Supabase Dashboard:
   - URL: https://supabase.com/dashboard/project/xbcwbzsgvmerkbnnplep/auth/settings
   
2. Navigate to: **Authentication → Settings**

### Step 2: Disable Email Confirmations

1. Scroll down to **"Email Auth"** section
2. **Uncheck** the option: **"Enable email confirmations"**
3. Click **Save** at the bottom of the page

**What this does:**
- Users can sign up and log in immediately without verifying their email
- No verification emails are sent (prevents bounces)
- Perfect for development and testing with fake emails

---

## 🧪 Updated Test User Strategy

Our seed script (`scripts/seed-users.ts`) now uses:

### Primary Test Account (REAL EMAIL)
```
Email: ayo.ogunrekun@holidayextras.com
Password: Test123!
Name: Ayo Ogunrekun
Role: PPC Manager and AI Lead
```

**Why:** 
- This is your real email, so no bounces
- You can test email-related features (password reset, notifications) if needed
- Can receive actual emails from Supabase

### Secondary Test Accounts (FAKE EMAILS - Safe when confirmation disabled)
```
Email: michael.chen@holidayextras.com (fake)
Email: emma.williams@holidayextras.com (fake)
Email: james.anderson@holidayextras.com (fake)
Email: olivia.martinez@holidayextras.com (fake)
Password: Test123! (all accounts)
```

**Why:**
- With email confirmation disabled, these won't cause bounces
- Provides multiple test accounts for multi-user scenarios
- Realistic email addresses for UI testing

---

## 🔧 When to Re-Enable Email Confirmation

**For Production/Staging:**
1. **Before deploying to production**, re-enable email confirmations
2. **Set up custom SMTP provider** (recommended by Supabase):
   - Go to: Authentication → Settings → SMTP Settings
   - Configure your own email provider (SendGrid, AWS SES, Mailgun)
   - Benefits: Higher limits, better deliverability, custom branding

3. **Update seed script or use real emails** for staging environment

---

## 📧 Email Providers for Production

When ready for production, consider these SMTP providers:

| Provider | Free Tier | Setup Difficulty |
|----------|-----------|------------------|
| **SendGrid** | 100 emails/day | Easy |
| **AWS SES** | 62,000 emails/month | Medium |
| **Mailgun** | 5,000 emails/month | Easy |
| **Postmark** | 100 emails/month | Easy |

**Supabase Documentation:**
- Custom SMTP Setup: https://supabase.com/docs/guides/auth/auth-smtp

---

## ✅ Current Configuration Checklist

- [x] Email confirmation **DISABLED** for development
- [x] Primary test account uses **real email** (ayo.ogunrekun@holidayextras.com)
- [x] Secondary test accounts use **fake emails** (safe with confirmation disabled)
- [x] Seed script updated with configuration notes
- [ ] Before production: **Enable confirmation** and **set up custom SMTP**

---

## 🚀 Running the Seed Script

After disabling email confirmation:

```bash
npm run seed:users
```

Expected output:
```
✅ Created user: ayo.ogunrekun@holidayextras.com
✅ Created user: michael.chen@holidayextras.com
✅ Created user: emma.williams@holidayextras.com
✅ Created user: james.anderson@holidayextras.com
✅ Created user: olivia.martinez@holidayextras.com

✅ All 5 test users created successfully!
```

---

## 📚 Additional Resources

- **Supabase Auth Documentation:** https://supabase.com/docs/guides/auth
- **Email Deliverability Best Practices:** https://supabase.com/docs/guides/platform/going-into-prod#auth-rate-limits
- **Custom SMTP Configuration:** https://supabase.com/docs/guides/auth/auth-smtp

