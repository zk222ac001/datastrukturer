# AdSense activation for LearnCodeVisually (Cloudflare Pages)

**Preparation only:** this pull request does NOT activate advertising. Do not insert example publisher IDs or a fabricated `ads.txt` file.

## Steps the site owner must complete

1. Sign in to https://adsense.google.com/ and open **Sites**. Add **learncodevisually.com** and check whether it is pending, approved, or needs connection.
2. Copy the exact **publisher ID** (e.g. `pub-1234567890123456`) from AdSense **Account > Settings > Account information**, or Google's own site-verification code. You may share a publisher ID but do not share your Google password or authentication tokens.
3. Verify the operator's identity, contact information, and actual data-processing setup. Add a **private contact email** and responsible operator/controller information to the draft privacy/contact pages as appropriate. Ensure the descriptions match all enabled Cloudflare, analytics, and third-party services.
4. Configure and publish a **Google-certified IAB TCF consent management platform** for relevant EEA, UK and Swiss users. Google AdSense **Privacy & messaging** is an option. Check that users can reject or manage consent and that ads and other cookies are handled in accordance with applicable laws.
5. After the publisher ID and CMP are known, add the *exact Google-provided* AdSense verification/Auto ads code within the `<head>` of **index.html**. If separate HTML pages need advertising, add it there as appropriate. Do not enable ad delivery before the privacy and consent review.
6. Create **ads.txt** at the deployed site root with the exact record provided by AdSense. The typical format is `google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0` — **this example is not usable as-is**. Verify https://learncodevisually.com/ads.txt returns the actual record, without HTML.
7. Submit the site for review in AdSense. Approval may take several days, sometimes 2–4 weeks. Review **Policy center** issues if any are reported.
8. If approved, configure **Ads > By site**. Begin with a small number of ads away from buttons, code editors, diagrams, and quizzes. Test on mobile.
9. Merge the reviewed GitHub pull request to your **actual Cloudflare Pages production branch**. Confirm changes are deployed. No Cloudflare server migration is needed.

## Other launch checks

- Add https://learncodevisually.com/sitemap.xml to Google Search Console.
- Check that About, Contact, Privacy, Terms and robots.txt are reachable.
- Verify Cloudflare deploys this exact GitHub repository and branch; otherwise migrate these changes to the real source.
- Audit original lesson quality, navigation, mobile speed, accessibility, external code links, and any embedded video or image licenses.
- Do not click your own ads or encourage students to click ads.

Official resources:
- https://support.google.com/adsense/answer/7584263
- https://support.google.com/adsense/answer/9724
- https://support.google.com/adsense/answer/13554116
- https://support.google.com/adsense/answer/7670013
