# How to Set Static IP Address (192.168.0.117)

This guide will help you configure your computer to always use **192.168.0.117** as its IP address, so your app is always accessible at `https://192.168.0.117:3001/`

## Current Status

- **Current IP**: 192.168.11.157
- **Desired IP**: 192.168.0.117
- **Current Gateway**: 192.168.11.1

## ⚠️ Important Note

Your current network uses the **192.168.11.x** subnet, but you want to use **192.168.0.117**. This will only work if:

1. Your router supports the 192.168.0.x subnet, OR
2. You change your router's configuration to use 192.168.0.x instead of 192.168.11.x

## Option 1: Set Static IP in Current Subnet (Recommended)

Set a static IP in your current network (192.168.11.x):

### Steps:

1. Press `Win + R`, type `ncpa.cpl`, press Enter
2. Right-click on **Wi-Fi** → **Properties**
3. Double-click **Internet Protocol Version 4 (TCP/IPv4)**
4. Select **Use the following IP address**
5. Enter these values:
   - **IP address**: `192.168.11.117` (or any number between 2-254 that's not in use)
   - **Subnet mask**: `255.255.255.0`
   - **Default gateway**: `192.168.11.1`
   - **Preferred DNS**: `8.8.8.8`
   - **Alternate DNS**: `8.8.4.4`
6. Click **OK** → **OK**
7. Restart your network adapter or computer

### Access Your App:

- **From phones**: `https://192.168.11.117:3001/`

## Option 2: Change Router to 192.168.0.x Subnet

If you specifically need 192.168.0.117:

### Steps:

1. Access your router admin panel (usually `http://192.168.11.1`)
2. Login with admin credentials
3. Find **LAN Settings** or **Network Settings**
4. Change the router's IP from `192.168.11.1` to `192.168.0.1`
5. Save and restart router
6. Then follow Option 1 steps but use:
   - **IP address**: `192.168.0.117`
   - **Default gateway**: `192.168.0.1`

## Option 3: Use DHCP Reservation (Easiest)

Configure your router to always assign 192.168.0.117 to your computer:

### Steps:

1. Access router admin panel
2. Find **DHCP Reservation** or **Address Reservation**
3. Add a new reservation:
   - **MAC Address**: Your computer's MAC address
   - **IP Address**: `192.168.0.117`
4. Save and restart router
5. Restart your computer

### Find Your MAC Address:

```bash
ipconfig /all
```

Look for "Physical Address" under Wi-Fi adapter.

## Quick Test After Setup

After setting static IP, verify it worked:

```bash
ipconfig
```

You should see your new IP address listed under Wi-Fi adapter.

Then restart the dev server:

```bash
npm run dev
```

The app will now always be at your chosen IP address!

## Current Server Status

The development server is configured to bind to all network interfaces (`0.0.0.0`), which means it will work with whatever IP address your computer has. Once you set a static IP, the server will automatically use that IP.
