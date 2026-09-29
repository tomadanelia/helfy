# DoktorABC landing page

A responsive landing page built with plain HTML, CSS, and vanilla JavaScript. No package installation or build step is required.

## Run locally

Open `index.html` in a browser. Google Fonts are loaded online; the page uses system fallbacks if they are unavailable.

## Project structure

```text
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    └── README.md
```

## Add the design assets

Place the corresponding artwork in `assets/` using these filenames:

- `Vector.svg` - header logo mark
- `DoktorABCd.svg` - header wordmark
- `hero-man.svg` - cut-out hero photo
- `phone.svg` - questionnaire phone artwork for step 1
- `smiling-doctor.svg` - doctor portrait for step 2
- `shutterstock.svg` - delivery artwork for step 3

The SVG files currently contain simple local placeholders so the page runs without missing requests; replace their contents with exports from Figma, or update the corresponding `src` attributes if you use other filenames. The German questionnaire in step 1, brand wordmark, and simple trust/social marks are built from HTML and CSS.

## Interactions

The review and how-it-works carousels support arrow buttons, pagination dots, and touch swipes on mobile. The announcement strip pauses on hover or keyboard focus. The desktop CTA links to the how-it-works section.

## Notes

The implementation follows the supplied written design measurements. The source `.fig` file and its original artwork were not present in the workspace, so exact image crops, original review copy, and official trust/social logo artwork remain to be supplied. The newsletter/account/search/cart controls are visual header elements only; no backend or destination flows were included in the assignment details.

## Optional review prompt

> Review this plain HTML, CSS, and vanilla JavaScript landing page against its written desktop and mobile design specifications. Check semantic markup, keyboard accessibility, responsive layout at 1920 px, 1280 px, and 390 px, carousel behavior, missing-asset handling, and browser console errors. Report specific issues with file references and propose minimal fixes without adding frameworks or dependencies.
