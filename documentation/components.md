# Component Overview

All components are in [`src/components/`](../src/components/):

- **ApplicationTips**: Displays tips for users.
- **BlogCard, BlogContent, BlogFilters, BlogSearch**: Blog-related UI.
- **DormCard, DormCardSkeleton, DormMap, DormMapLeaflet, DormSearchAndFilters, DormSearchPage**: Dormitory search and display.
- **ExternalLink**: For external URLs.
- **FAQ**: Frequently Asked Questions section.
- **Footer**: Website footer.
- **HomePage**: Main landing page content.
- **LocaleSwitcher, LocaleSwitcherSelect**: Language selection.
- **MobileNavbar, Navbar**: Navigation bars for mobile and desktop.

### How Components Are Related

- **Navbar** and **MobileNavbar** are used for site navigation.
- **HomePage** is the main entry point, using other components like **FAQ** and **DormCard**.
- **Blog** components are used for the blog section, fetching data via Sanity.
- **LocaleSwitcher** enables language switching, using `next-intl`.
- **DormMapLeaflet** and related components provide map-based dorm search.

See each file in [`src/components/`](../src/components/) for details.