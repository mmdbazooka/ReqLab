# A workbench for figuring things out

ReqLab uses navy surfaces, blue actions, monospace endpoint details, fine grid lines, and compact corners. The dashboard is a launchpad: saved endpoints on the left, a selectable request preview in the middle, and recent activity to the right. Collections are organized as rows rather than decorative summary cards.

Desktop navigation is horizontal, with a persistent environment selector. Mobile exposes navigation through an accessible expandable menu and scrolls the endpoint selector horizontally. The landing page presents an interactive GET/POST example beside the headline, followed by a workflow strip and practical feature details.

The independent `identity.css` layer sits between component styles and Tailwind utilities. Light mode, Persian/RTL, request cancellation, history, and local persistence remain supported. Toolbar-aware scroll margins keep focused controls usable beneath the header.
