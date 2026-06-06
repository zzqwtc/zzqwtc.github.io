# Academic Homepage

This is a static academic homepage with Git-backed content management.

## Edit locally

Update these files:

- `content/profile.json` for name, affiliation, email, links, and about text.
- `content/news.json` for news items.
- `content/publications.json` for publications.
- `content/tutorials.json` for tutorials.
- `content/services.json` for service items.
- `content/education.json` for education.
- `content/links.json` for useful links.

## Edit with Pages CMS

1. Push this folder to a GitHub repository.
2. Go to `https://app.pagescms.org/`.
3. Sign in with GitHub and install the Pages CMS GitHub App for the repository.
4. Open the repository in Pages CMS.
5. Use the sections defined in `.pages.yml` to edit profile, news, publications, education, and links.

Uploaded images are stored in `assets/` and referenced as `/assets/...`.

## Preview locally

Run a static server from this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
