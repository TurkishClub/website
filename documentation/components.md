# Component Overview

All components are in [`src/components/`](../src/components/).

Below is a list of each file and its purpose, along with key dependencies and relationships.

---

## Component List & Descriptions

- **ApplicationTips.tsx**  
  Displays helpful tips for users.  
  *Depends on*: `Card`, `Badge` UI components.

- **BlogCard.tsx**  
  Renders a single blog post preview card.  
  *Depends on*: `Image`, `Link`, translation hooks.

- **BlogContent.tsx**  
  Handles blog post listing, filtering, and search.  
  *Depends on*: `BlogCard`, `BlogSearch`, translation hooks.

- **BlogFilters.tsx**  
  UI for filtering blog posts by category/date/etc.  
  *Depends on*: translation hooks.

- **BlogSearch.tsx**  
  Search input for filtering blog posts.  
  *Depends on*: translation hooks.

- **DormCard.tsx**  
  Displays information about a single dormitory.  
  *Depends on*: `Badge`, `Button`, `ExternalLink`, translation hooks.

- **DormCardSkeleton.tsx**  
  Skeleton loader for dorm cards during data fetch.  
  *Depends on*: UI skeleton components.

- **DormMap.tsx**  
  Map view for dorm locations (may use Google Maps or similar).  
  *Depends on*: Map libraries.

- **DormMapLeaflet.tsx**  
  Map view for dorms using Leaflet.  
  *Depends on*: `leaflet`, `react-leaflet`, `Button`, `Badge`, translation hooks.

- **DormSearchAndFilters.tsx**  
  Combined search and filter UI for dorms.  
  *Depends on*: `DormSearchPage`, translation hooks.

- **DormSearchPage.tsx**  
  Main page for searching and viewing dorms in different modes (grid/list/map).  
  *Depends on*: `DormCard`, `DormMapLeaflet`, `DormCardSkeleton`, `Button`, translation hooks.

- **ExternalLink.tsx**  
  Renders external links with appropriate attributes.

- **FAQ.tsx**  
  Frequently Asked Questions section, expandable/collapsible.  
  *Depends on*: translation hooks.

- **Footer.tsx**  
  Website footer with links and info.

- **HomePage.tsx**  
  Main landing page content.  
  *Depends on*: `MobileNavbar`, `FAQ`, `Footer`, translation hooks.

- **LocaleSwitcher.tsx**  
  Language selection dropdown.  
  *Depends on*: `next-intl`, translation hooks.

- **LocaleSwitcherSelect.tsx**  
  Alternative UI for language selection.  
  *Depends on*: `next-intl`, translation hooks.

- **MobileNavbar.tsx**  
  Responsive navigation bar for mobile devices.  
  *Depends on*: `Sheet`, `Button`, `LocaleSwitcher`, `Link`, translation hooks.

- **Navbar.tsx**  
  Main navigation bar for desktop.  
  *Depends on*: `DropdownMenu`, `LocaleSwitcher`, `Link`, translation hooks.

- **PageLayout.tsx**  
  Layout wrapper for pages, provides consistent styling and structure.  
  *Depends on*: children components.

- **ui/**  
  Contains reusable UI primitives (e.g., `button.tsx`, `card.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `dialog.tsx`, `select.tsx`, etc.)  
  *Used by*: Most higher-level components for consistent UI.

---

## Component Dependencies & Relationships

- **Navbar** and **MobileNavbar** are used for site navigation and appear on most pages.
- **HomePage** is the main entry point, using **MobileNavbar**, **FAQ**, and **Footer**.
- **BlogContent** uses **BlogCard** and **BlogSearch** for the blog section.
- **DormSearchPage** uses **DormCard**, **DormMapLeaflet**, and **DormCardSkeleton** for dormitory search.
- **LocaleSwitcher** and **LocaleSwitcherSelect** are used in navigation bars for language switching.
- **FAQ** and **ApplicationTips** use translation hooks for localized content.
- **UI components** in `ui/` are used throughout for consistent design and behavior.

---

See each file in [`src/components/`](../src/components/)