# Unported inventory — Cronus Audit

Generated 2026-09-13 from React SoT `cooud-ui` + live kernel dispatch.
**Nothing is claimed ported.** `button_ex` means a dedicated kernel renderer exists, not that Audit `ported` is true.

Classification: interact wins before widgets match; button is `button_ex`; remaining FAMILIES are `chart`/`fx` stubs; else `missing`.
`pill`/`field`/`overlay`/`nav`/`display` are dead widgets arms (recorded in `notes` as `deadWidgetsArm`).

## Totals

| Wave | Content | Count | Live renderer mix |
|---|---|---|---|
| 0 | button, badge, input | 3 | 2 `interact`, 1 `button_ex` |
| 1 | remaining buttons/forms/display/feedback | 73 | 65 `interact`, 3 `fx`, 3 `missing`, 2 `chart` |
| 2 | overlays + navigation + date-time | 34 | 30 `interact`, 3 `missing`, 1 `fx` |
| 3 | charts | 18 | 18 `chart` |
| 4 | premium | 60 | 34 `fx`, 15 `interact`, 11 `missing` |
| 5 | ai-elements 23 + preloaders 1 | 24 | 24 `missing` |
| 6 | blocks | 74 | 74 `missing` |
| 7 | templates | 25 | 25 `missing` |
| **Σ** | | **311** | none ported |

212 components + 74 blocks + 25 templates = 311.

## Wave 0 DOM traps

- Button: `data-slot="button"` + `data-variant`, **no `data-size`**, `asChild` Slot.
- Badge: `<span data-slot="badge" data-variant>`; default `"default"`. Live: interact `pill()`.
- Input: `<input data-slot="input">` **not** label wrapper; interact emits `input-control`.

## React slugs not in FAMILIES (41)

- `animated-checkbox`
- `goal-card`
- `todo-item`
- `author-tooltip`
- `component-preview-tooltip`
- `link-preview`
- `scroll-nav`
- `number-flow`
- `slide-up-text`
- `images-badge`
- `globe-3d`
- `globe-wireframe`
- `explore-nav`
- `bouncy-accordion`
- `token-swap`
- `receive-button`
- `family-wallet`
- `actions`
- `artifact`
- `branch`
- `chain-of-thought`
- `ai-code-block`
- `context`
- `conversation`
- `ai-image`
- `inline-citation`
- `loader`
- `message`
- `open-in-chat`
- `plan`
- `prompt-input`
- `queue`
- `reasoning`
- `response`
- `sources`
- `suggestion`
- `task`
- `text-shimmer`
- `tool`
- `web-preview`
- `words-preloader`

## Kernel extras

- `toast` — interact; React catalog slug is `sonner` (`data-slot="toaster"`).
- `motion-presets` — fx stub; not a documented component.

## Items

### Wave 0 (3)

| slug | kind | category | kernelRenderer | kernelFamily |
|---|---|---|---|---|
| `button` | component | buttons | `button_ex` | `button` |
| `badge` | component | data-display | `interact` | `badge` |
| `input` | component | forms | `interact` | `input` |

### Wave 1 (73)

| slug | kind | category | kernelRenderer | kernelFamily |
|---|---|---|---|---|
| `animated-button` | component | buttons | `fx` | `animated-button` |
| `toggle` | component | buttons | `interact` | `toggle` |
| `toggle-group` | component | buttons | `interact` | `toggle-group` |
| `copy-button` | component | buttons | `interact` | `copy-button` |
| `button-group` | component | buttons | `interact` | `button-group` |
| `fab` | component | buttons | `interact` | `fab` |
| `split-button` | component | buttons | `interact` | `split-button` |
| `mode-toggle` | component | buttons | `interact` | `mode-toggle` |
| `input-group` | component | forms | `interact` | `input-group` |
| `password-input` | component | forms | `interact` | `password-input` |
| `textarea` | component | forms | `interact` | `textarea` |
| `label` | component | forms | `interact` | `label` |
| `checkbox` | component | forms | `interact` | `checkbox` |
| `animated-checkbox` | component | forms | `missing` | `—` |
| `radio-group` | component | forms | `interact` | `radio-group` |
| `switch` | component | forms | `interact` | `switch` |
| `select` | component | forms | `interact` | `select` |
| `combobox` | component | forms | `interact` | `combobox` |
| `multi-select` | component | forms | `interact` | `multi-select` |
| `tags-input` | component | forms | `interact` | `tags-input` |
| `slider` | component | forms | `interact` | `slider` |
| `field` | component | forms | `interact` | `field` |
| `form` | component | forms | `interact` | `form` |
| `input-otp` | component | forms | `interact` | `input-otp` |
| `file-dropzone` | component | forms | `interact` | `file-dropzone` |
| `number-input` | component | forms | `interact` | `number-input` |
| `autocomplete` | component | forms | `interact` | `autocomplete` |
| `stepper` | component | forms | `interact` | `stepper` |
| `rich-text-editor` | component | forms | `interact` | `rich-text-editor` |
| `rating` | component | forms | `interact` | `rating` |
| `color-picker` | component | forms | `interact` | `color-picker` |
| `currency-input` | component | forms | `interact` | `currency-input` |
| `phone-input` | component | forms | `interact` | `phone-input` |
| `credit-card-input` | component | forms | `interact` | `credit-card-input` |
| `floating-label-input` | component | forms | `interact` | `floating-label-input` |
| `signature-pad` | component | forms | `interact` | `signature-pad` |
| `chip` | component | forms | `interact` | `chip` |
| `avatar` | component | data-display | `interact` | `avatar` |
| `avatar-group` | component | data-display | `interact` | `avatar-group` |
| `card` | component | data-display | `interact` | `card` |
| `goal-card` | component | data-display | `missing` | `—` |
| `table` | component | data-display | `interact` | `table` |
| `data-table` | component | data-display | `interact` | `data-table` |
| `metric` | component | data-display | `interact` | `metric` |
| `sparkline` | component | data-display | `chart` | `sparkline` |
| `masonry` | component | data-display | `interact` | `masonry` |
| `comparison-slider` | component | data-display | `fx` | `comparison-slider` |
| `heatmap` | component | data-display | `chart` | `heatmap` |
| `kbd` | component | data-display | `interact` | `kbd` |
| `empty` | component | data-display | `interact` | `empty` |
| `separator` | component | data-display | `interact` | `separator` |
| `skeleton` | component | data-display | `interact` | `skeleton` |
| `scroll-area` | component | data-display | `interact` | `scroll-area` |
| `code-block` | component | data-display | `interact` | `code-block` |
| `code-tabs` | component | data-display | `interact` | `code-tabs` |
| `collapsible` | component | data-display | `interact` | `collapsible` |
| `aspect-ratio` | component | data-display | `interact` | `aspect-ratio` |
| `tree-view` | component | data-display | `interact` | `tree-view` |
| `timeline` | component | data-display | `interact` | `timeline` |
| `kanban` | component | data-display | `interact` | `kanban` |
| `todo-item` | component | data-display | `missing` | `—` |
| `json-viewer` | component | data-display | `interact` | `json-viewer` |
| `status-dot` | component | data-display | `interact` | `status-dot` |
| `image-zoom` | component | data-display | `fx` | `image-zoom` |
| `video-player` | component | data-display | `interact` | `video-player` |
| `description-list` | component | data-display | `interact` | `description-list` |
| `alert` | component | feedback | `interact` | `alert` |
| `banner` | component | feedback | `interact` | `banner` |
| `spinner` | component | feedback | `interact` | `spinner` |
| `progress` | component | feedback | `interact` | `progress` |
| `usage-meter` | component | feedback | `interact` | `usage-meter` |
| `sonner` | component | feedback | `interact` | `sonner` |
| `alert-dialog` | component | feedback | `interact` | `alert-dialog` |

### Wave 2 (34)

| slug | kind | category | kernelRenderer | kernelFamily |
|---|---|---|---|---|
| `dialog` | component | overlays | `interact` | `dialog` |
| `sheet` | component | overlays | `interact` | `sheet` |
| `drawer` | component | overlays | `interact` | `drawer` |
| `popover` | component | overlays | `interact` | `popover` |
| `notification-center` | component | overlays | `interact` | `notification-center` |
| `hover-card` | component | overlays | `interact` | `hover-card` |
| `author-tooltip` | component | overlays | `missing` | `—` |
| `tooltip` | component | overlays | `interact` | `tooltip` |
| `component-preview-tooltip` | component | overlays | `missing` | `—` |
| `link-preview` | component | overlays | `missing` | `—` |
| `dropdown-menu` | component | overlays | `interact` | `dropdown-menu` |
| `context-menu` | component | overlays | `interact` | `context-menu` |
| `command` | component | overlays | `interact` | `command` |
| `lightbox` | component | overlays | `interact` | `lightbox` |
| `confirmation-dialog` | component | overlays | `interact` | `confirmation-dialog` |
| `invite-dialog` | component | overlays | `interact` | `invite-dialog` |
| `tabs` | component | navigation | `interact` | `tabs` |
| `accordion` | component | navigation | `interact` | `accordion` |
| `breadcrumb` | component | navigation | `interact` | `breadcrumb` |
| `pagination` | component | navigation | `interact` | `pagination` |
| `navigation-menu` | component | navigation | `interact` | `navigation-menu` |
| `menubar` | component | navigation | `interact` | `menubar` |
| `sidebar` | component | navigation | `interact` | `sidebar` |
| `app-shell` | component | navigation | `interact` | `app-shell` |
| `workspace-switcher` | component | navigation | `interact` | `workspace-switcher` |
| `resizable` | component | navigation | `interact` | `resizable` |
| `toolbar` | component | navigation | `interact` | `toolbar` |
| `table-of-contents` | component | navigation | `interact` | `table-of-contents` |
| `calendar` | component | date-time | `interact` | `calendar` |
| `countdown` | component | date-time | `fx` | `countdown` |
| `date-picker` | component | date-time | `interact` | `date-picker` |
| `date-range-picker` | component | date-time | `interact` | `date-range-picker` |
| `scheduler` | component | date-time | `interact` | `scheduler` |
| `time-picker` | component | date-time | `interact` | `time-picker` |

### Wave 3 (18)

| slug | kind | category | kernelRenderer | kernelFamily |
|---|---|---|---|---|
| `chart` | chart | charts | `chart` | `chart` |
| `area-chart` | chart | charts | `chart` | `area-chart` |
| `line-chart` | chart | charts | `chart` | `line-chart` |
| `live-line-chart` | chart | charts | `chart` | `live-line-chart` |
| `bar-chart` | chart | charts | `chart` | `bar-chart` |
| `composed-chart` | chart | charts | `chart` | `composed-chart` |
| `candlestick-chart` | chart | charts | `chart` | `candlestick-chart` |
| `funnel-chart` | chart | charts | `chart` | `funnel-chart` |
| `gauge-chart` | chart | charts | `chart` | `gauge-chart` |
| `pie-chart` | chart | charts | `chart` | `pie-chart` |
| `ring-chart` | chart | charts | `chart` | `ring-chart` |
| `radar-chart` | chart | charts | `chart` | `radar-chart` |
| `scatter-chart` | chart | charts | `chart` | `scatter-chart` |
| `sankey-chart` | chart | charts | `chart` | `sankey-chart` |
| `profit-loss-chart` | chart | charts | `chart` | `profit-loss-chart` |
| `choropleth-chart` | chart | charts | `chart` | `choropleth-chart` |
| `sunburst-chart` | chart | charts | `chart` | `sunburst-chart` |
| `heatmap-chart` | chart | charts | `chart` | `heatmap-chart` |

### Wave 4 (60)

| slug | kind | category | kernelRenderer | kernelFamily |
|---|---|---|---|---|
| `glass-card` | component | premium | `interact` | `glass-card` |
| `gradient-border` | component | premium | `fx` | `gradient-border` |
| `gradient-text` | component | premium | `fx` | `gradient-text` |
| `spotlight-card` | component | premium | `interact` | `spotlight-card` |
| `scroll-progress` | component | premium | `interact` | `scroll-progress` |
| `scroll-nav` | component | premium | `missing` | `—` |
| `aurora-background` | component | premium | `fx` | `aurora-background` |
| `logo-carousel` | component | premium | `interact` | `logo-carousel` |
| `marquee` | component | premium | `fx` | `marquee` |
| `morphing-popover` | component | premium | `interact` | `morphing-popover` |
| `shimmer` | component | premium | `fx` | `shimmer` |
| `reveal` | component | premium | `fx` | `reveal` |
| `animated-number` | component | premium | `fx` | `animated-number` |
| `number-flow` | component | premium | `missing` | `—` |
| `carousel` | component | premium | `interact` | `carousel` |
| `segmented-control` | component | premium | `interact` | `segmented-control` |
| `text-effect` | component | premium | `fx` | `text-effect` |
| `slide-up-text` | component | premium | `missing` | `—` |
| `images-badge` | component | premium | `missing` | `—` |
| `globe-3d` | component | premium | `missing` | `—` |
| `globe-wireframe` | component | premium | `missing` | `—` |
| `frame` | component | premium | `interact` | `frame` |
| `dock` | component | premium | `interact` | `dock` |
| `border-beam` | component | premium | `fx` | `border-beam` |
| `flip-card` | component | premium | `interact` | `flip-card` |
| `tilt-card` | component | premium | `interact` | `tilt-card` |
| `magnetic` | component | premium | `fx` | `magnetic` |
| `orbit` | component | premium | `fx` | `orbit` |
| `terminal` | component | premium | `interact` | `terminal` |
| `ripple` | component | premium | `fx` | `ripple` |
| `meteors` | component | premium | `fx` | `meteors` |
| `dot-pattern` | component | premium | `fx` | `dot-pattern` |
| `grid-pattern` | component | premium | `fx` | `grid-pattern` |
| `retro-grid` | component | premium | `fx` | `retro-grid` |
| `noise` | component | premium | `fx` | `noise` |
| `light-rays` | component | premium | `fx` | `light-rays` |
| `progressive-blur` | component | premium | `fx` | `progressive-blur` |
| `flickering-grid` | component | premium | `fx` | `flickering-grid` |
| `star-border` | component | premium | `fx` | `star-border` |
| `shiny-text` | component | premium | `fx` | `shiny-text` |
| `highlighter` | component | premium | `fx` | `highlighter` |
| `spinning-text` | component | premium | `fx` | `spinning-text` |
| `sparkles-text` | component | premium | `fx` | `sparkles-text` |
| `typing-text` | component | premium | `fx` | `typing-text` |
| `word-rotate` | component | premium | `fx` | `word-rotate` |
| `scramble-text` | component | premium | `fx` | `scramble-text` |
| `glare-hover` | component | premium | `fx` | `glare-hover` |
| `click-spark` | component | premium | `fx` | `click-spark` |
| `animated-list` | component | premium | `fx` | `animated-list` |
| `card-stack` | component | premium | `interact` | `card-stack` |
| `pill-nav` | component | premium | `interact` | `pill-nav` |
| `expandable-tabs` | component | premium | `interact` | `expandable-tabs` |
| `explore-nav` | component | premium | `missing` | `—` |
| `bouncy-accordion` | component | premium | `missing` | `—` |
| `token-swap` | component | premium | `missing` | `—` |
| `receive-button` | component | premium | `missing` | `—` |
| `family-wallet` | component | premium | `missing` | `—` |
| `dynamic-island` | component | premium | `fx` | `dynamic-island` |
| `confetti` | component | premium | `fx` | `confetti` |
| `particles` | component | premium | `fx` | `particles` |

### Wave 5 (24)

| slug | kind | category | kernelRenderer | kernelFamily |
|---|---|---|---|---|
| `actions` | component | ai-elements | `missing` | `—` |
| `artifact` | component | ai-elements | `missing` | `—` |
| `branch` | component | ai-elements | `missing` | `—` |
| `chain-of-thought` | component | ai-elements | `missing` | `—` |
| `ai-code-block` | component | ai-elements | `missing` | `—` |
| `context` | component | ai-elements | `missing` | `—` |
| `conversation` | component | ai-elements | `missing` | `—` |
| `ai-image` | component | ai-elements | `missing` | `—` |
| `inline-citation` | component | ai-elements | `missing` | `—` |
| `loader` | component | ai-elements | `missing` | `—` |
| `message` | component | ai-elements | `missing` | `—` |
| `open-in-chat` | component | ai-elements | `missing` | `—` |
| `plan` | component | ai-elements | `missing` | `—` |
| `prompt-input` | component | ai-elements | `missing` | `—` |
| `queue` | component | ai-elements | `missing` | `—` |
| `reasoning` | component | ai-elements | `missing` | `—` |
| `response` | component | ai-elements | `missing` | `—` |
| `sources` | component | ai-elements | `missing` | `—` |
| `suggestion` | component | ai-elements | `missing` | `—` |
| `task` | component | ai-elements | `missing` | `—` |
| `text-shimmer` | component | ai-elements | `missing` | `—` |
| `tool` | component | ai-elements | `missing` | `—` |
| `web-preview` | component | ai-elements | `missing` | `—` |
| `words-preloader` | component | preloaders | `missing` | `—` |

### Wave 6 (74)

| slug | kind | category | kernelRenderer | kernelFamily |
|---|---|---|---|---|
| `login` | block | auth | `missing` | `—` |
| `signup` | block | auth | `missing` | `—` |
| `forgot-password` | block | auth | `missing` | `—` |
| `otp` | block | auth | `missing` | `—` |
| `magic-link` | block | auth | `missing` | `—` |
| `hero` | block | marketing | `missing` | `—` |
| `pricing` | block | marketing | `missing` | `—` |
| `feature-grid` | block | marketing | `missing` | `—` |
| `cta` | block | marketing | `missing` | `—` |
| `testimonials` | block | marketing | `missing` | `—` |
| `faq` | block | marketing | `missing` | `—` |
| `footer` | block | marketing | `missing` | `—` |
| `navbar` | block | marketing | `missing` | `—` |
| `stats` | block | application | `missing` | `—` |
| `settings` | block | application | `missing` | `—` |
| `team` | block | application | `missing` | `—` |
| `welcome` | block | onboarding | `missing` | `—` |
| `setup-wizard` | block | onboarding | `missing` | `—` |
| `setup-checklist` | block | onboarding | `missing` | `—` |
| `dashboard` | block | dashboard | `missing` | `—` |
| `billing` | block | billing | `missing` | `—` |
| `manage-subscription` | block | billing | `missing` | `—` |
| `payment-method` | block | billing | `missing` | `—` |
| `usage-dashboard` | block | billing | `missing` | `—` |
| `cancel-flow` | block | billing | `missing` | `—` |
| `checkout` | block | commerce | `missing` | `—` |
| `payouts` | block | commerce | `missing` | `—` |
| `product-grid` | block | commerce | `missing` | `—` |
| `invoice` | block | commerce | `missing` | `—` |
| `page-header` | block | page | `missing` | `—` |
| `filter-bar` | block | page | `missing` | `—` |
| `empty-state` | block | page | `missing` | `—` |
| `status-page` | block | page | `missing` | `—` |
| `chat-thread` | block | ai | `missing` | `—` |
| `prompt-box` | block | ai | `missing` | `—` |
| `ai-response` | block | ai | `missing` | `—` |
| `not-found` | block | states | `missing` | `—` |
| `error-state` | block | states | `missing` | `—` |
| `success-state` | block | states | `missing` | `—` |
| `maintenance` | block | states | `missing` | `—` |
| `email-welcome` | block | email | `missing` | `—` |
| `email-receipt` | block | email | `missing` | `—` |
| `email-verify` | block | email | `missing` | `—` |
| `notification-panel` | block | notifications | `missing` | `—` |
| `activity-feed` | block | notifications | `missing` | `—` |
| `toast-stack` | block | notifications | `missing` | `—` |
| `nps-survey` | block | survey | `missing` | `—` |
| `feedback-form` | block | survey | `missing` | `—` |
| `contact-form` | block | survey | `missing` | `—` |
| `post-card` | block | social | `missing` | `—` |
| `comment-thread` | block | social | `missing` | `—` |
| `profile-card` | block | social | `missing` | `—` |
| `changelog` | block | changelog | `missing` | `—` |
| `integrations` | block | integrations | `missing` | `—` |
| `waitlist` | block | waitlist | `missing` | `—` |
| `feature-matrix` | block | feature-matrix | `missing` | `—` |
| `product-detail` | block | store | `missing` | `—` |
| `cart` | block | store | `missing` | `—` |
| `order-tracking` | block | store | `missing` | `—` |
| `order-history` | block | store | `missing` | `—` |
| `reviews` | block | store | `missing` | `—` |
| `account-security` | block | account | `missing` | `—` |
| `sessions` | block | account | `missing` | `—` |
| `api-keys` | block | account | `missing` | `—` |
| `notification-preferences` | block | account | `missing` | `—` |
| `user-management` | block | admin | `missing` | `—` |
| `analytics` | block | admin | `missing` | `—` |
| `kanban-board` | block | admin | `missing` | `—` |
| `audit-log` | block | admin | `missing` | `—` |
| `blog` | block | content | `missing` | `—` |
| `blog-post` | block | content | `missing` | `—` |
| `logo-cloud` | block | content | `missing` | `—` |
| `about` | block | content | `missing` | `—` |
| `app-shell-chrome` | block | shell | `missing` | `—` |

### Wave 7 (25)

| slug | kind | category | kernelRenderer | kernelFamily |
|---|---|---|---|---|
| `saas` | template | product | `missing` | `—` |
| `admin` | template | product | `missing` | `—` |
| `docs` | template | product | `missing` | `—` |
| `store` | template | product | `missing` | `—` |
| `landing` | template | product | `missing` | `—` |
| `landing-studio` | template | landing | `missing` | `—` |
| `landing-ops` | template | landing | `missing` | `—` |
| `landing-secure` | template | landing | `missing` | `—` |
| `landing-care` | template | landing | `missing` | `—` |
| `landing-shop` | template | landing | `missing` | `—` |
| `landing-docs` | template | landing | `missing` | `—` |
| `landing-premium` | template | landing | `missing` | `—` |
| `landing-agents` | template | landing | `missing` | `—` |
| `landing-coverage` | template | landing | `missing` | `—` |
| `landing-broadcast` | template | landing | `missing` | `—` |
| `landing-agency` | template | landing | `missing` | `—` |
| `landing-glass` | template | landing | `missing` | `—` |
| `mail` | template | product | `missing` | `—` |
| `chat` | template | product | `missing` | `—` |
| `finance` | template | product | `missing` | `—` |
| `default` | template | starter | `missing` | `—` |
| `dashboard` | template | starter | `missing` | `—` |
| `marketing` | template | starter | `missing` | `—` |
| `gontify` | template | starter | `missing` | `—` |
| `portfolio` | template | starter | `missing` | `—` |

