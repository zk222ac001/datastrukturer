# Connect LearnCodeVisually to Google AdSense

Current publisher ID (provided by the site owner): **pub-4289954810677587**

## Included in this pull request

- Ownership verification meta tag in `index.html`:
  `<meta name="google-adsense-account" content="ca-pub-4289954810677587">`
- Root-level `ads.txt`:
  `google.com, pub-4289954810677587, DIRECT, f08c47fec0942fa0`
- About, Contact, Privacy and Terms informational pages and navigation links
- `robots.txt` and `sitemap.xml`

**Important:** The verification META tag is a Google-supported alternative to the JavaScript snippet. This change **does not load the AdSense advertising script or show ads**. Meta-tag verification is an intentional first step to avoid loading advertising technology before the appropriate Google-certified consent management platform (CMP) is configured.

## To verify ownership in AdSense

1. Confirm Cloudflare Pages uses GitHub repository `zk222ac001/datastrukturer`, `main` branch. If not, apply the changes in the actual connected deployment source.
2. Merge this pull request after reviewing the legal and privacy pages and deploy to Cloudflare.
3. In a private browser window, check https://learncodevisually.com/ and View Page Source: the tag `google-adsense-account` must appear within `<head>`. Also check https://learncodevisually.com/ads.txt shows exactly the account record.
4. Go to Google AdSense > Sites > `learncodevisually.com`, select **Meta tag** (not "AdSense code snippet"), tick **I've placed the code**, click **Verify**, then **Request review**.
5. In AdSense **Privacy & messaging**, configure/publish the Google-certified CMP for European regulations (EEA, UK, Switzerland); use appropriate consent options and verify live behavior. Review any applicable other privacy notices.
6. Before ads are switched on, the owner must complete and verify the privacy notice: responsible operator/controller identity, private contact address, Cloudflare products/logging, actual external services, advertising providers, and user choices. The draft is not sufficient by itself to prove compliance.
7. Wait for the **Ready** status in AdSense. Approval may take days or weeks.
8. Only after consent and approval are properly configured, add the AdSense JavaScript loader to the pages where ads are desired, and configure Auto ads or appropriate ad units. Exact Google-provided snippet for this account:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4289954810677587" crossorigin="anonymous"></script>
```

9. Avoid ad placements that can be mistaken for quiz answers, code run buttons or navigation. Do not click your own ads.

Reference: https://support.google.com/adsense/answer/12169212
Ads.txt guide: https://support.google.com/adsense/answer/12171612
Google-certified CMP requirements: https://support.google.com/adsense/answer/13554116

This repository has not been connected to AdSense or Cloudflare accounts through their private APIs. Their console steps require the website owner's access and authorization.
