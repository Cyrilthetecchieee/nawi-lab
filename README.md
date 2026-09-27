# NAWI Laboratory demo

A browser-based demonstration of NAWI evaluation intake, observation entry, calculation traceability, review and printable demo reports.

## Run locally

Open `dist/index.html` in a browser or serve `dist/` with a local static server, such as `python -m http.server 8000 --directory dist`.

## Scope and limitations

- Demo records are stored in browser localStorage. They are not shared between users or devices and can be lost when browser storage is cleared.
- The role picker demonstrates workflow screens; it is not authentication or authorization.
- Error calculations are browser-side demonstration calculations, not authoritative backend Decimal calculations.
- No verified OIML R 76 rule set is configured. Compliance is always REFERENCE REQUIRED; no regulatory PASS or APPROVED decision is produced.
- Reports open as printable HTML and can be saved as PDF using the browser's print dialog. Native DOCX generation, attachments, backend APIs, database, and secure audit trails are not implemented.
- All seed observations are synthetic demonstration data. Do not use the site for laboratory or regulatory decisions.

The source for the published Site is in `dist/`. The `.openai/hosting.json` file associates it with the Site project.
