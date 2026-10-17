# Trade source and reuse

Data: **UN Comtrade**, presented through the World Bank's **World Integrated Trade Solution (WITS)**. Retrieved 17 October 2026.

UN Comtrade data remain United Nations copyright. This is **not** a CC BY or public-domain dataset. The official re-dissemination FAQ allows limited commercial tables containing fewer than 100,000 total records. This 910-row, freely accessible visualization extract fits that stated small-table case. Keep its attribution, and reassess the terms if the product starts charging for this data or substantially expands the Comtrade collection. The policy also directs automated access to the API rather than scraping Comtrade's own UI.

Primary terms checked:

- https://uncomtrade.org/docs/re-dissemination-of-data/ — particularly “I want to re-disseminate data for commercial purposes.”
- https://uncomtrade.org/docs/policy-on-comtrade-data-use/
- https://comtrade.un.org/licenseagreement.html — linked by the policy; the linked agreement was not independently downloaded during this recovery.

Suggested visible attribution: **UN Comtrade via World Bank WITS · reported merchandise exports · [row year]**. Include the selected country's `sourceUrl`.

The source URLs and factual numeric rows are preserved in `source-extracts.json`. WITS pages state that these are reported values, without gap filling. Values are rounded in the WITS summary; this extract does not imply additional precision.

Country-code normalization uses the application's existing `world-countries` lookup (ODbL 1.0). No country geometries are copied into this trade asset. The original WITS partner names are retained alongside ISO codes.
