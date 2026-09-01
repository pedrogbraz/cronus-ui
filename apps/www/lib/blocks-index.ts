/**
 * Server-safe metadata for "Blocks" — larger, copy-paste UI sections composed
 * from @cronus-ui/ui primitives. The live preview + source live in `lib/blocks/*`.
 */

export interface BlockMeta {
  slug: string;
  name: string;
  description: string;
  variants?: BlockVariantMeta[];
}

export interface BlockVariantMeta {
  id: string;
  name: string;
  description: string;
}

export interface BlockCategory {
  slug: string;
  name: string;
  items: BlockMeta[];
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    slug: "auth",
    name: "Auth",
    items: [
      {
        slug: "login",
        name: "Login",
        description: "A centered authentication card with email + social login.",
        variants: [
          {
            id: "classic",
            name: "Classic card",
            description: "Centered email and password card with social sign-in shortcuts.",
          },
          {
            id: "split",
            name: "Split panel",
            description:
              "Brand gradient panel with a customer testimonial beside the sign-in form.",
          },
          {
            id: "social-first",
            name: "Social first",
            description: "Google, GitHub, and Apple buttons stacked above the email fallback.",
          },
          {
            id: "minimal",
            name: "Minimal",
            description:
              "Ultra-clean logo mark, email, and continue button with quiet footer links.",
          },
        ],
      },
      {
        slug: "signup",
        name: "Sign Up",
        description: "A create-account card with email, password, terms, and social sign-up.",
        variants: [
          {
            id: "classic",
            name: "Classic card",
            description: "Centered create-account card with social sign-up shortcuts.",
          },
          {
            id: "split",
            name: "Split panel",
            description:
              "Brand gradient panel with a customer testimonial beside the create-account form.",
          },
          {
            id: "split-proof",
            name: "Split with proof",
            description:
              "Create-account form beside customer logos, a star rating, and short quotes.",
          },
          {
            id: "with-plan",
            name: "With plan summary",
            description:
              "Signup form beside the selected plan, trial terms, and first-charge summary.",
          },
        ],
      },
      {
        slug: "forgot-password",
        name: "Forgot Password",
        description:
          "A password reset flow with an email request, a sent confirmation, and a new-password form.",
        variants: [
          {
            id: "request",
            name: "Request link",
            description: "Email entry that sends a one-time password reset link.",
          },
          {
            id: "sent",
            name: "Link sent",
            description: "Confirmation that a reset link was emailed, with a resend action.",
          },
          {
            id: "reset",
            name: "Set new password",
            description: "Tokenized new-password form that completes the reset link from email.",
          },
        ],
      },
      {
        slug: "otp",
        name: "Two-Factor Code",
        description: "A two-factor authentication card with a six-digit one-time code entry.",
      },
      {
        slug: "magic-link",
        name: "Magic Link",
        description: "A passwordless email link flow with a request and a sent confirmation.",
        variants: [
          {
            id: "request",
            name: "Request link",
            description: "Passwordless email entry that sends a single-use sign-in link.",
          },
          {
            id: "sent",
            name: "Link sent",
            description:
              "Confirmation that a magic sign-in link was emailed, with a resend action.",
          },
        ],
      },
    ],
  },
  {
    slug: "account",
    name: "Account",
    items: [
      {
        slug: "account-security",
        name: "Account security",
        description: "Two-factor authentication setup and password management with a danger zone.",
        variants: [
          {
            id: "two-factor",
            name: "Two-factor setup",
            description: "Status card plus QR pairing, setup key, and one-time backup codes.",
          },
          {
            id: "password",
            name: "Password & danger zone",
            description: "Password change with strength meter, recovery email, and a danger zone.",
          },
        ],
      },
      {
        slug: "sessions",
        name: "Sessions",
        description: "Active device sessions with per-session and bulk revoke.",
        variants: [
          {
            id: "list",
            name: "Device list",
            description: "Signed-in devices with client, location, last activity, and revoke.",
          },
          {
            id: "table",
            name: "Selectable table",
            description: "Session table with bulk selection and a revoke-selected action.",
          },
        ],
      },
      {
        slug: "api-keys",
        name: "API keys",
        description: "API key management with masked secrets, scopes, and a scoped create flow.",
        variants: [
          {
            id: "list",
            name: "Key list",
            description: "Masked keys with reveal and copy, scope badges, and usage metadata.",
          },
          {
            id: "create",
            name: "Create key",
            description: "Scoped key creation with expiry and a one-time generated-key reveal.",
          },
        ],
      },
      {
        slug: "notification-preferences",
        name: "Notification preferences",
        description: "Per-channel notification controls as a matrix or grouped toggle list.",
        variants: [
          {
            id: "matrix",
            name: "Channel matrix",
            description: "Per-event switches across email, push, and SMS, grouped by area.",
          },
          {
            id: "simple",
            name: "Simple toggles",
            description: "Grouped email toggles with a plain-language description per row.",
          },
        ],
      },
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    items: [
      {
        slug: "hero",
        name: "Hero",
        description: "A centered marketing hero with eyebrow, headline, copy and CTAs.",
        variants: [
          {
            id: "centered",
            name: "Centered launch",
            description: "Classic centered SaaS hero with trust proof and two CTAs.",
          },
          {
            id: "split",
            name: "Split dashboard",
            description: "Two-column hero with a compact product-quality panel.",
          },
          {
            id: "compact",
            name: "Compact registry",
            description: "Contained hero card for docs, registries and template libraries.",
          },
          {
            id: "atmosphere",
            name: "Atmosphere",
            description:
              "Centered launch hero over a receding grid floor, shooting stars, and a typing headline.",
          },
        ],
      },
      {
        slug: "pricing",
        name: "Pricing",
        description: "A three-tier pricing grid with a highlighted plan.",
        variants: [
          {
            id: "tiers",
            name: "Three tiers",
            description: "A responsive three-plan grid with a highlighted popular tier.",
          },
          {
            id: "toggle",
            name: "Plan toggle",
            description: "Two-plan pricing with a monthly/annual segmented control.",
          },
          {
            id: "usage",
            name: "Usage based",
            description: "A metered pricing layout for API, infra and event-based products.",
          },
        ],
      },
      {
        slug: "feature-matrix",
        name: "Feature Matrix",
        description:
          "A plan-comparison matrix with grouped feature rows, per-plan checks and limits, and an elevated popular column that stacks into cards on mobile.",
      },
      {
        slug: "feature-grid",
        name: "Feature Grid",
        description: "A responsive grid of product features with icons.",
        variants: [
          {
            id: "cards",
            name: "Card grid",
            description: "Six balanced feature cards for broad capability overviews.",
          },
          {
            id: "bento",
            name: "Bento grid",
            description: "Editorial bento layout for showcasing a platform narrative.",
          },
        ],
      },
      {
        slug: "cta",
        name: "Call to Action",
        description: "A bold gradient call-to-action banner.",
        variants: [
          {
            id: "classic",
            name: "Gradient panel",
            description: "Contained gradient panel with an email-capture form and dotted texture.",
          },
          {
            id: "banner",
            name: "Gradient banner",
            description: "Full-width gradient band with a display headline and dual CTAs.",
          },
          {
            id: "split-visual",
            name: "Split with visual",
            description: "Copy and checkmark bullets beside a token-built product mock panel.",
          },
        ],
      },
      {
        slug: "testimonials",
        name: "Testimonials",
        description: "Social proof with avatar trust line and a wall of customer testimonials.",
        variants: [
          {
            id: "marquee",
            name: "Marquee wall",
            description:
              "A scrolling, pause-on-hover wall of testimonials with avatar social proof.",
          },
          {
            id: "grid",
            name: "Card grid",
            description: "A static responsive grid of testimonial cards for dense social proof.",
          },
        ],
      },
      {
        slug: "faq",
        name: "FAQ",
        description: "An accessible accordion of frequently asked questions.",
        variants: [
          {
            id: "accordion",
            name: "Centered accordion",
            description: "A centered, width-constrained accordion of common questions and answers.",
          },
          {
            id: "split",
            name: "Split with support",
            description: "A two-column layout pairing the questions with a contact-support panel.",
          },
        ],
      },
      {
        slug: "footer",
        name: "Footer",
        description: "A full site footer with brand block, link columns, and a newsletter sign-up.",
        variants: [
          {
            id: "classic",
            name: "Columns with newsletter",
            description: "Brand column, three link columns and a newsletter panel.",
          },
          {
            id: "mega",
            name: "Mega",
            description: "Five link columns, newsletter, social icons and a live-status legal row.",
          },
          {
            id: "minimal",
            name: "Minimal",
            description: "A single-row footer with logo, three links and copyright.",
          },
        ],
      },
      {
        slug: "navbar",
        name: "Navbar",
        description: "A contained, rounded marketing navigation bar with brand mark and CTAs.",
        variants: [
          {
            id: "classic",
            name: "Pill with actions",
            description: "Rounded navbar with brand badge, primary links and sign-in actions.",
          },
          {
            id: "centered",
            name: "Centered pill",
            description: "Floating pill navbar with centered links on a blurred overlay surface.",
          },
          {
            id: "with-announcement",
            name: "With announcement",
            description: "Announcement bar with a badge and link above the navigation row.",
          },
        ],
      },
      {
        slug: "changelog",
        name: "Changelog",
        description:
          "A product release feed on a vertical timeline with version badges, dates, and typed Feature/Fix/Perf change rows.",
      },
      {
        slug: "waitlist",
        name: "Waitlist Hero",
        description:
          "A waitlist capture hero with an early-access pill, a gradient headline, an inline email form that swaps to a joined state, and avatar social proof.",
      },
    ],
  },
  {
    slug: "content",
    name: "Content",
    items: [
      {
        slug: "blog",
        name: "Blog",
        description:
          "Blog index layouts: a featured hero post with a responsive post grid, and an editorial list with larger typography.",
        variants: [
          {
            id: "grid",
            name: "Featured grid",
            description: "A featured hero post above a responsive three-column post grid.",
          },
          {
            id: "list",
            name: "Editorial list",
            description: "An editorial list layout with larger typography and horizontal cards.",
          },
        ],
      },
      {
        slug: "blog-post",
        name: "Blog post",
        description:
          "Article detail layouts with token-styled prose (headings, blockquote, inline code), author card, hero art, and a share row.",
        variants: [
          {
            id: "article",
            name: "Article",
            description: "A single-column article with token-styled prose and a share row.",
          },
          {
            id: "with-sidebar",
            name: "With sidebar",
            description: "The article beside a sticky table of contents and a newsletter card.",
          },
        ],
      },
      {
        slug: "logo-cloud",
        name: "Logo cloud",
        description:
          "Customer trust sections built from wordmark-style text logos in text-fg-tertiary — a quiet grid and a dual counter-scrolling marquee.",
        variants: [
          {
            id: "grid",
            name: "Trust grid",
            description: "A quiet responsive grid of customer wordmarks under a trust heading.",
          },
          {
            id: "marquee",
            name: "Dual marquee",
            description:
              "Two counter-scrolling, pause-on-hover marquee rows of customer wordmarks.",
          },
        ],
      },
      {
        slug: "about",
        name: "About",
        description:
          "Company about sections: mission story with stats, founder quote, and milestone timeline; plus a values card grid with a token-built culture collage.",
        variants: [
          {
            id: "story",
            name: "Story",
            description: "Mission statement, stats row, founder quote, and a milestone timeline.",
          },
          {
            id: "values",
            name: "Values",
            description: "A values card grid with icons and a token-built culture collage.",
          },
        ],
      },
    ],
  },
  {
    slug: "application",
    name: "Application",
    items: [
      {
        slug: "stats",
        name: "Stats Cards",
        description: "A dashboard row of KPI metric cards with trends.",
        variants: [
          {
            id: "kpi-grid",
            name: "KPI grid",
            description: "Four-card dashboard metrics with icons, deltas, and contextual hints.",
          },
          {
            id: "compact-summary",
            name: "Compact summary",
            description: "A single-card metric summary for dense dashboards and overview panels.",
          },
          {
            id: "pipeline-funnel",
            name: "Pipeline funnel",
            description: "A segmented stats card for activation, pipeline, or conversion steps.",
          },
        ],
      },
      {
        slug: "settings",
        name: "Settings Panel",
        description: "An account settings form with switches and inputs.",
      },
      {
        slug: "team",
        name: "Team Members",
        description: "A team list with avatars, roles and a menu.",
      },
    ],
  },
  {
    slug: "onboarding",
    name: "Onboarding",
    items: [
      {
        slug: "welcome",
        name: "Welcome",
        description: "A get-started welcome panel with quick-start actions.",
      },
      {
        slug: "setup-wizard",
        name: "Setup Wizard",
        description: "A multi-step setup flow with a stepper and a form panel.",
      },
      {
        slug: "setup-checklist",
        name: "Setup Checklist",
        description: "A setup-progress checklist with a progress bar and per-item actions.",
      },
    ],
  },
  {
    slug: "social",
    name: "Social",
    items: [
      {
        slug: "post-card",
        name: "Post Card",
        description: "A social post with author, content, and engagement actions.",
      },
      {
        slug: "comment-thread",
        name: "Comment Thread",
        description: "A threaded comment list with a composer and a nested reply.",
      },
      {
        slug: "profile-card",
        name: "Profile Card",
        description: "A user profile card with a cover, stats, and a follow action.",
      },
    ],
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    items: [
      {
        slug: "dashboard",
        name: "Dashboard",
        description: "A full application shell with sidebar nav, KPI cards, a chart, and a table.",
        variants: [
          {
            id: "analytics",
            name: "Analytics dashboard",
            description:
              "A full application shell — sidebar nav, search topbar, KPI cards, a revenue chart and a recent-activity table.",
          },
          {
            id: "admin-overview",
            name: "Admin overview",
            description:
              "An admin console with an icon-collapsible sidebar, status cards, a signups trend and a larger users & orders table.",
          },
        ],
      },
    ],
  },
  {
    slug: "admin",
    name: "Admin",
    items: [
      {
        slug: "user-management",
        name: "User management",
        description:
          "Team member administration for a B2B SaaS workspace — a searchable directory table with role filter, status badges, per-user action menus and pagination, plus a card-grid variant for small teams.",
        variants: [
          {
            id: "table",
            name: "Directory table",
            description:
              "A searchable member table with a role filter, status badges, row actions and pagination.",
          },
          {
            id: "cards",
            name: "Member cards",
            description: "A card grid with the same member actions — a better fit for small teams.",
          },
        ],
      },
      {
        slug: "analytics",
        name: "Analytics",
        description:
          "Admin analytics surfaces — KPI metrics with sparklines, a 30-day traffic trend and top pages/referrers breakdowns with progress bars, plus a cohort-retention engagement variant built from token-colored heat cells.",
        variants: [
          {
            id: "overview",
            name: "Traffic overview",
            description:
              "KPI metrics with sparklines, a 30-day traffic trend and top pages and referrers breakdowns.",
          },
          {
            id: "engagement",
            name: "Engagement cohorts",
            description:
              "Retention stat cards plus a weekly cohort heat grid built from token-colored cells.",
          },
        ],
      },
      {
        slug: "kanban-board",
        name: "Kanban board",
        description:
          "A sprint board with four columns of labeled cards — Badge labels, assignee avatar stacks, due dates and comment counts — plus a dense compact variant with per-column WIP limits and at-limit indicators.",
        variants: [
          {
            id: "default",
            name: "Sprint board",
            description:
              "Four columns of labeled cards with assignees, due dates, comment counts and add actions.",
          },
          {
            id: "compact",
            name: "Compact WIP board",
            description:
              "A dense single-line task list with per-column WIP limits and at-limit indicators.",
          },
        ],
      },
      {
        slug: "audit-log",
        name: "Audit log",
        description:
          "A security audit trail — a grouped-by-day timeline feed with actor avatars, emphasized actor/object names and severity badges, plus a filterable table variant with event-type badges, actors, IPs and expandable detail hints.",
        variants: [
          {
            id: "timeline",
            name: "Day-grouped timeline",
            description:
              "A grouped-by-day security feed with actor avatars, emphasized names and severity badges.",
          },
          {
            id: "table",
            name: "Filterable table",
            description:
              "A filterable event table with type badges, actors, IP addresses and detail affordances.",
          },
        ],
      },
    ],
  },
  {
    slug: "billing",
    name: "Billing",
    items: [
      {
        slug: "billing",
        name: "Billing",
        description: "Subscription management, usage meters, invoices, and a plan selector.",
        variants: [
          {
            id: "subscription",
            name: "Subscription",
            description:
              "Current plan, usage meters, payment method, and a downloadable invoice history.",
          },
          {
            id: "plans",
            name: "Plan selector",
            description:
              "Three-tier plan picker with a highlighted popular plan and a monthly/annual toggle.",
          },
        ],
      },
      {
        slug: "manage-subscription",
        name: "Manage Subscription",
        description:
          "A current-subscription card with a renewal banner, usage meters, payment method, and plan actions.",
      },
      {
        slug: "payment-method",
        name: "Payment Method",
        description:
          "Choose a saved card from a radio list or add a new card with a full card-entry form.",
        variants: [
          {
            id: "select",
            name: "Select method",
            description:
              "Pick a saved card from a radio list, mark a default, or add a new payment method.",
          },
          {
            id: "add-card",
            name: "Add card",
            description:
              "A new-card form with cardholder, number, expiry, CVC, and a set-as-default toggle.",
          },
        ],
      },
      {
        slug: "usage-dashboard",
        name: "Usage Dashboard",
        description:
          "A usage analytics panel with metric cards, trend sparklines, quota meters, and a top-resources table.",
      },
      {
        slug: "cancel-flow",
        name: "Cancel Flow",
        description:
          "A cancellation survey with reason options and a retention offer to keep the subscription.",
      },
    ],
  },
  {
    slug: "commerce",
    name: "Commerce",
    items: [
      {
        slug: "checkout",
        name: "Checkout",
        description: "A product checkout with an order summary and a card payment form.",
        variants: [
          {
            id: "classic",
            name: "Card payment",
            description: "Two-column checkout with an order summary beside a card payment form.",
          },
          {
            id: "one-page",
            name: "One page",
            description:
              "Single-page checkout stacking contact, shipping, and payment beside a sticky order summary.",
          },
          {
            id: "multi-step",
            name: "Multi-step",
            description:
              "Wizard checkout with a shipping–payment–review stepper and back/continue navigation.",
          },
        ],
      },
      {
        slug: "payouts",
        name: "Payouts",
        description:
          "A creator payout dashboard with balance cards and a settlement history table.",
      },
      {
        slug: "product-grid",
        name: "Product Grid",
        description:
          "A digital-products storefront grid of product cards with prices and buy buttons.",
        variants: [
          {
            id: "classic",
            name: "Storefront grid",
            description: "Three-column storefront grid with product art, pricing, and buy actions.",
          },
          {
            id: "with-filters",
            name: "With filters",
            description:
              "Catalog layout with category, price, and color filters beside a sortable product grid.",
          },
          {
            id: "showcase",
            name: "Editorial showcase",
            description: "Hero product feature with an asymmetric grid and overlay shop actions.",
          },
        ],
      },
      {
        slug: "invoice",
        name: "Invoice",
        description: "An invoice receipt with line items, totals, status, and a download action.",
        variants: [
          {
            id: "classic",
            name: "Detailed invoice",
            description:
              "Full invoice with billing parties, line items, totals, and a download action.",
          },
          {
            id: "receipt",
            name: "Receipt",
            description:
              "Narrow thermal-style receipt with mono totals, dashed separators, and a paid stamp.",
          },
        ],
      },
    ],
  },
  {
    slug: "store",
    name: "Store",
    items: [
      {
        slug: "product-detail",
        name: "Product detail",
        description:
          "Full product page section with gallery art, rating, variant selectors, quantity stepper, add-to-cart CTA and detail accordions.",
        variants: [
          {
            id: "standard",
            name: "Standard",
            description:
              "Full product page with variant selectors, a quantity stepper and detail accordions.",
          },
          {
            id: "gallery",
            name: "Gallery",
            description: "Thumbnail rail beside the main image, with a quick spec strip.",
          },
          {
            id: "minimal",
            name: "Minimal",
            description: "Centered single-column layout, ideal for one-product stores.",
          },
        ],
      },
      {
        slug: "cart",
        name: "Cart",
        description:
          "Shopping cart surfaces: a full cart page with editable line items and order summary, and a static slide-over drawer composition.",
        variants: [
          {
            id: "page",
            name: "Cart page",
            description: "Full cart page with editable line items and an order summary.",
          },
          {
            id: "drawer",
            name: "Drawer",
            description: "Slide-over mini cart with a free-shipping meter and quick checkout.",
          },
        ],
      },
      {
        slug: "order-tracking",
        name: "Order tracking",
        description:
          "Shipment status card with a vertical timeline, ETA banner and courier info across in-transit, delivered and delayed states.",
        variants: [
          {
            id: "in-transit",
            name: "In transit",
            description: "Shipment timeline with the current leg highlighted and courier info.",
          },
          {
            id: "delivered",
            name: "Delivered",
            description: "Completed timeline with a delivery confirmation and a review prompt.",
          },
          {
            id: "delayed",
            name: "Delayed",
            description: "Late shipment with a warning notice, a new estimate and support actions.",
          },
        ],
      },
      {
        slug: "order-history",
        name: "Order history",
        description:
          "Customer purchase history as a dense table with row actions or stacked order cards with thumbnails and reorder.",
        variants: [
          {
            id: "table",
            name: "Table",
            description: "Dense orders table with status badges and a per-row actions menu.",
          },
          {
            id: "cards",
            name: "Cards",
            description: "Stacked order cards with item thumbnails and one-tap reorder.",
          },
        ],
      },
      {
        slug: "reviews",
        name: "Reviews",
        description:
          "Customer reviews: aggregate rating with distribution bars plus top reviews, or a dense compact grid of short reviews.",
        variants: [
          {
            id: "summary",
            name: "Summary",
            description: "Aggregate rating with a distribution chart next to the top reviews.",
          },
          {
            id: "compact",
            name: "Compact grid",
            description: "Dense grid of short reviews for landing and product pages.",
          },
        ],
      },
    ],
  },
  {
    slug: "page",
    name: "Page sections",
    items: [
      {
        slug: "page-header",
        name: "Page Header",
        description: "A page header with breadcrumbs, title, status, actions, and optional tabs.",
        variants: [
          {
            id: "with-actions",
            name: "Title and actions",
            description:
              "Breadcrumb, title with status badge, supporting copy, and primary/secondary actions.",
          },
          {
            id: "with-tabs",
            name: "Title and tabs",
            description: "Adds a section tab row beneath the header for switching detail views.",
          },
        ],
      },
      {
        slug: "filter-bar",
        name: "Filter Bar",
        description: "A search and filter toolbar with chips and a result count.",
        variants: [
          {
            id: "toolbar",
            name: "Search and filters",
            description:
              "Search input, status select, owner combobox, list/grid toggle, removable filter chips, and a result count.",
          },
        ],
      },
      {
        slug: "empty-state",
        name: "Empty State",
        description: "Empty and error states with illustrations, guidance, and recovery actions.",
        variants: [
          {
            id: "empty",
            name: "Empty list",
            description: "A friendly empty list with an illustration, guidance, and creation CTAs.",
          },
          {
            id: "error",
            name: "Error / not found",
            description:
              "An error state for failed loads or 404s, with retry and recovery actions.",
          },
        ],
      },
      {
        slug: "status-page",
        name: "Status Page",
        description:
          "A service-status section with an operational banner, per-service 45-day uptime bars, and an incident-history link.",
      },
    ],
  },
  {
    slug: "ai",
    name: "AI & Chat",
    items: [
      {
        slug: "chat-thread",
        name: "Chat Thread",
        description:
          "An assistant conversation card with user and AI bubbles, a typing indicator, and a message composer.",
      },
      {
        slug: "prompt-box",
        name: "Prompt Box",
        description:
          "A standalone AI composer with suggestion chips, a model picker, and attach and send actions.",
      },
      {
        slug: "ai-response",
        name: "AI Response",
        description:
          "An assistant answer card with formatted content, cited sources, and feedback and regenerate actions.",
      },
    ],
  },
  {
    slug: "notifications",
    name: "Notifications",
    items: [
      {
        slug: "notification-panel",
        name: "Notification Panel",
        description:
          "A dropdown notifications list with avatars, unread markers, and a mark-all-read action.",
      },
      {
        slug: "activity-feed",
        name: "Activity Feed",
        description:
          "A vertical timeline of recent events with toned icons, timestamps, and detail.",
      },
      {
        slug: "toast-stack",
        name: "Toast Stack",
        description:
          "A stack of success, error, warning, and info toasts with icons and dismiss actions.",
      },
    ],
  },
  {
    slug: "email",
    name: "Email",
    items: [
      {
        slug: "email-welcome",
        name: "Welcome Email",
        description: "A branded welcome email with a get-started CTA and onboarding quick links.",
      },
      {
        slug: "email-receipt",
        name: "Receipt Email",
        description:
          "A branded purchase receipt email with an itemized table, totals, and an invoice action.",
      },
      {
        slug: "email-verify",
        name: "Verify Email",
        description:
          "An email-confirmation message with a verify button and a fallback one-time code.",
      },
    ],
  },
  {
    slug: "states",
    name: "States",
    items: [
      {
        slug: "not-found",
        name: "Not Found",
        description:
          "A centered 404 page with a search field and back-to-home and support actions.",
      },
      {
        slug: "error-state",
        name: "Error State",
        description:
          "A full-page error state with an error code, a retry action, and a support link.",
      },
      {
        slug: "success-state",
        name: "Success State",
        description: "A centered confirmation state with a success icon and follow-up actions.",
      },
      {
        slug: "maintenance",
        name: "Maintenance",
        description:
          "A scheduled-maintenance page with an estimated downtime and a notify-me email capture.",
      },
    ],
  },
  {
    slug: "survey",
    name: "Feedback",
    items: [
      {
        slug: "nps-survey",
        name: "NPS Survey",
        description: "An NPS card with a 0–10 score scale and an open-ended reason field.",
      },
      {
        slug: "feedback-form",
        name: "Feedback Form",
        description:
          "A feedback card with a star rating, category chips, and an optional details field.",
      },
      {
        slug: "contact-form",
        name: "Contact Form",
        description:
          "A two-column contact section pairing contact methods with a name, email, and message form.",
      },
    ],
  },
  {
    slug: "integrations",
    name: "Integrations",
    items: [
      {
        slug: "integrations",
        name: "Integrations Grid",
        description:
          "A marketing integrations section with an eyebrow header and a responsive grid of connectable service tiles.",
      },
    ],
  },
  {
    slug: "shell",
    name: "App Shell",
    items: [
      {
        slug: "app-shell-chrome",
        name: "App Shell",
        description:
          "A sidebar + header application shell that wraps page content — the chrome the (app) route group uses for dashboard pages.",
      },
    ],
  },
];

export const ALL_BLOCKS: (BlockMeta & { category: string })[] = BLOCK_CATEGORIES.flatMap((c) =>
  c.items.map((item) => ({ ...item, category: c.name })),
);

export function getBlockMeta(slug: string): (BlockMeta & { category: string }) | undefined {
  return ALL_BLOCKS.find((b) => b.slug === slug);
}

export function getBlockVariantMetas(slug: string): BlockVariantMeta[] {
  const meta = getBlockMeta(slug);
  if (!meta) return [];

  return meta.variants?.length
    ? meta.variants
    : [{ id: "default", name: meta.name, description: meta.description }];
}

export function getBlockVariantMeta(slug: string, variantId: string): BlockVariantMeta | undefined {
  return getBlockVariantMetas(slug).find((variant) => variant.id === variantId);
}

export const BLOCK_SLUGS = ALL_BLOCKS.map((b) => b.slug);
export const BLOCK_COUNT = ALL_BLOCKS.length;
export const BLOCK_VARIANT_COUNT = ALL_BLOCKS.reduce(
  (total, block) => total + (block.variants?.length ?? 1),
  0,
);
export const BLOCK_VARIANT_PARAMS = ALL_BLOCKS.flatMap((block) =>
  (block.variants?.length
    ? block.variants
    : [{ id: "default", name: block.name, description: block.description }]
  ).map((variant) => ({ slug: block.slug, variant: variant.id })),
);
