# 🌐 Connect sniptaste.com to Netlify - Complete Guide

## ✅ What You Need to Do

You have:

- ✅ Domain: **sniptaste.com** (registered with Namecheap)
- ✅ Netlify site: **https://sniptaste-test1.netlify.app/**

Goal: Make **sniptaste.com** point to your Netlify site!

---

## 📋 Step-by-Step Instructions

### **Step 1: Add Domain in Netlify**

1. **Go to your Netlify site dashboard**
   - Visit: https://app.netlify.com/sites/sniptaste-test1/

2. **Click "Add domain" button** (as shown in your screenshot)
   - You're already on the right page!

3. **Enter your domain**
   - Type: `sniptaste.com`
   - Click "Verify"

4. **Netlify will show you DNS records**
   - Keep this page open - you'll need these records!

---

### **Step 2: Configure DNS at Namecheap**

#### **Option A: Use Netlify DNS (Recommended - Easiest)**

1. **In Netlify**, after adding domain:
   - Click "Set up Netlify DNS"
   - Netlify will give you **4 nameservers** like:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```

2. **Go to Namecheap**:
   - Login to: https://www.namecheap.com/
   - Go to "Domain List"
   - Click "Manage" next to sniptaste.com

3. **Change Nameservers**:
   - Find "NAMESERVERS" section
   - Select "Custom DNS"
   - Enter the 4 Netlify nameservers
   - Click "Save"

4. **Wait for propagation** (5 minutes - 48 hours, usually ~1 hour)

---

#### **Option B: Keep Namecheap DNS (Manual Setup)**

If you prefer to keep Namecheap DNS:

1. **In Netlify**, note the DNS records shown:
   - Usually shows an A record or CNAME

2. **Go to Namecheap**:
   - Login and go to Domain List
   - Click "Manage" next to sniptaste.com
   - Go to "Advanced DNS" tab

3. **Add DNS Records**:

   **For Root Domain (sniptaste.com):**
   - Type: `A Record`
   - Host: `@`
   - Value: `75.2.60.5` (Netlify's load balancer IP)
   - TTL: `Automatic`

   **For www subdomain (www.sniptaste.com):**
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `sniptaste-test1.netlify.app`
   - TTL: `Automatic`

4. **Remove conflicting records**:
   - Delete any existing A records for `@`
   - Delete any existing CNAME for `www`
   - Keep only the new records

5. **Save changes**

---

### **Step 3: Verify in Netlify**

1. **Go back to Netlify**
   - Site Settings → Domain Management

2. **Check domain status**
   - Should show "Awaiting External DNS"
   - Then "DNS verification in progress"
   - Finally "Active" (when working)

3. **Enable HTTPS**
   - Netlify automatically provisions SSL certificate
   - Takes 1-2 minutes after DNS is verified

---

## 🎯 Quick Reference - DNS Records

### **If using Netlify DNS:**

```
Nameservers (at Namecheap):
- dns1.p01.nsone.net
- dns2.p01.nsone.net
- dns3.p01.nsone.net
- dns4.p01.nsone.net
```

### **If using Namecheap DNS:**

```
A Record:
Host: @
Value: 75.2.60.5

CNAME Record:
Host: www
Value: sniptaste-test1.netlify.app
```

---

## ⏱️ Timeline

| Step                    | Time                              |
| ----------------------- | --------------------------------- |
| Add domain in Netlify   | 1 minute                          |
| Update DNS at Namecheap | 2 minutes                         |
| DNS propagation         | 5 min - 48 hours (usually 1 hour) |
| SSL certificate         | 1-2 minutes after DNS verified    |
| **Total**               | **~1 hour typically**             |

---

## ✅ Verification Checklist

After setup, verify:

- [ ] https://sniptaste.com works
- [ ] https://www.sniptaste.com works
- [ ] Both redirect to HTTPS (secure)
- [ ] SSL certificate shows as valid
- [ ] Your app loads correctly

---

## 🔧 Troubleshooting

### **Domain not working after 24 hours?**

1. **Check DNS propagation**:
   - Visit: https://dnschecker.org/
   - Enter: sniptaste.com
   - Should show Netlify's IP or CNAME

2. **Check Namecheap settings**:
   - Ensure nameservers are correct
   - Or ensure A/CNAME records are correct
   - No conflicting records

3. **Check Netlify**:
   - Domain shows as "Active"
   - SSL certificate provisioned
   - No error messages

### **"Domain already registered" error?**

- The domain is already added to another Netlify site
- Remove it from the other site first
- Or contact Netlify support

### **SSL certificate not working?**

- Wait 2-3 minutes after DNS verification
- Check "HTTPS" settings in Netlify
- Click "Verify DNS configuration"
- Click "Provision certificate" if needed

---

## 📱 Recommended Setup

### **Best Practice:**

1. **Use Netlify DNS** (Option A above)
   - Easier to manage
   - Automatic configuration
   - Better performance
   - Faster updates

2. **Enable these in Netlify**:
   - ✅ Force HTTPS
   - ✅ Auto-renew SSL
   - ✅ Branch deploys (optional)

3. **Set up redirects**:
   - www → non-www (or vice versa)
   - Netlify handles this automatically!

---

## 🎯 What Happens After Setup

### **Your visitors can access:**

- ✅ https://sniptaste.com
- ✅ https://www.sniptaste.com
- ✅ Both work and are secure (HTTPS)

### **Old URL still works:**

- ✅ https://sniptaste-test1.netlify.app
- (You can hide this later if you want)

---

## 🚀 Quick Start (Recommended Path)

### **Fastest Method:**

1. **In Netlify** (your screenshot):
   - Click "Add domain"
   - Enter: `sniptaste.com`
   - Choose "Set up Netlify DNS"
   - Copy the 4 nameservers

2. **In Namecheap**:
   - Go to Domain List → Manage
   - Nameservers → Custom DNS
   - Paste the 4 Netlify nameservers
   - Save

3. **Wait ~1 hour**
   - DNS propagates
   - SSL auto-provisions
   - Done! ✅

---

## 📞 Need Help?

### **Netlify Support:**

- https://www.netlify.com/support/
- Live chat available

### **Namecheap Support:**

- https://www.namecheap.com/support/
- 24/7 live chat

### **Check DNS Propagation:**

- https://dnschecker.org/
- https://www.whatsmydns.net/

---

## 🎁 Bonus: After Domain is Connected

### **Optimize Your Setup:**

1. **Add to \_redirects file** (already exists):

   ```
   # Force HTTPS
   http://sniptaste.com/* https://sniptaste.com/:splat 301!
   http://www.sniptaste.com/* https://www.sniptaste.com/:splat 301!

   # Redirect www to non-www (or vice versa)
   https://www.sniptaste.com/* https://sniptaste.com/:splat 301!
   ```

2. **Update your social media**:
   - Use sniptaste.com everywhere
   - Better branding!

3. **Set up email** (optional):
   - Use Namecheap email forwarding
   - Or Google Workspace
   - Or Zoho Mail (free)

---

## ✅ Summary

**What you need to do RIGHT NOW:**

1. ✅ Click "Add domain" in Netlify
2. ✅ Enter "sniptaste.com"
3. ✅ Choose "Set up Netlify DNS"
4. ✅ Copy nameservers from Netlify
5. ✅ Go to Namecheap
6. ✅ Change to Custom DNS
7. ✅ Paste Netlify nameservers
8. ✅ Save and wait ~1 hour

**That's it!** Your domain will be live! 🎉

---

**Created**: December 14, 2025
**Domain**: sniptaste.com
**Netlify Site**: sniptaste-test1.netlify.app
**Status**: Ready to connect!

---

## 🎊 Next Steps

Once domain is connected:

1. Deploy your optimized app (`snip-optimized-deploy.zip`)
2. Test on sniptaste.com
3. Share with customers!
4. Celebrate! 🎉

Need help with any step? Just ask! 🚀
