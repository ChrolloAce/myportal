# 🎵 **TikTok OAuth Setup Guide**

## 🔑 **Your App Credentials**
```bash
Client Key: sbaw6qi55kaqklt0d5
Client Secret: LP9VknaI4xzc4LwIpkdyY8lBYAI4aMhJ
```

## 📋 **Step-by-Step OAuth Setup**

### **1. Add to Environment Variables**
Create or update your `frontend/.env.local` file:

```bash
# TikTok App Credentials
REACT_APP_TIKTOK_CLIENT_KEY=sbaw6qi55kaqklt0d5
REACT_APP_TIKTOK_CLIENT_SECRET=LP9VknaI4xzc4LwIpkdyY8lBYAI4aMhJ

# Access Token (you'll get this from OAuth)
REACT_APP_TIKTOK_ACCESS_TOKEN=your_access_token_here
```

### **2. OAuth Authorization URL**
Direct users to this URL to authorize your app:

```
https://www.tiktok.com/v2/auth/authorize/?client_key=sbaw6qi55kaqklt0d5&scope=video.list&response_type=code&redirect_uri=YOUR_REDIRECT_URI&state=YOUR_STATE
```

**Required Parameters:**
- `client_key`: `sbaw6qi55kaqklt0d5`
- `scope`: `video.list` (for analytics access)
- `response_type`: `code`
- `redirect_uri`: Your app's callback URL
- `state`: Random string for security

### **3. Handle Authorization Callback**
When user approves, TikTok redirects to your callback URL with:
```
https://your-app.com/callback?code=AUTHORIZATION_CODE&state=YOUR_STATE
```

### **4. Exchange Code for Access Token**
Make a POST request to get the access token:

```bash
curl -X POST "https://open-api.tiktok.com/oauth/access_token/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_key=sbaw6qi55kaqklt0d5" \
  -d "client_secret=LP9VknaI4xzc4LwIpkdyY8lBYAI4aMhJ" \
  -d "code=AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

**Response:**
```json
{
  "data": {
    "access_token": "act.example12345Example12345Example",
    "expires_in": 86400,
    "refresh_token": "rft.example12345Example12345Example",
    "token_type": "Bearer"
  }
}
```

### **5. Update Your Environment**
Once you get the access token, update your `.env.local`:

```bash
REACT_APP_TIKTOK_ACCESS_TOKEN=act.example12345Example12345Example
```

## 🔄 **Quick Test Setup (Alternative)**

If you want to test the UI without full OAuth, you can:

1. **Temporarily use a placeholder token** in your `.env.local`
2. **The TikTok Analytics component will show an error** but you can see the UI
3. **Implement full OAuth later** when ready for production

```bash
# Temporary placeholder (will show error but UI works)
REACT_APP_TIKTOK_ACCESS_TOKEN=placeholder_token_for_testing
```

## 🎯 **What Happens Next**

Once you have a valid access token:

1. **TikTok Analytics will work** in your admin dashboard
2. **Real-time video metrics** will be fetched from TikTok API
3. **Performance analytics** will show for approved TikTok videos
4. **Beautiful dashboard** will display views, likes, shares, engagement

## 🔒 **Security Notes**

- **Never commit secrets** to git
- **Use environment variables** for all credentials
- **Access tokens expire** - implement refresh token logic
- **Store tokens securely** in production

## 🚀 **Ready to Use**

Your TikTok Analytics integration is ready! Just need that access token to make it fully functional. The UI is already built and waiting for your data! 📊✨