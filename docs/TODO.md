This list is assumed to be in priority order. Next work items will be taken from
the top of the list unless agreed otherwise.

## Well Page Timeline Bar

Adds capability for users to adjust the time displayed in widgets placed
on well pages.

* Take and adapt the existing implementation in the corva-web develop branch
  if possible.
* If this proves impossible, probably needs a bespoke component.

![](mockups/timeline.png)

## Building For Deployment

Adds capability for the project to be built to production so that it can be deployed as part of `corva-web`.

* Modify frontend build configuration so that paths etc. are compatible.
* Integrate deployment with `corva-web` deployment process.

## Interoperation With corva-web Pages

Adds capability for the new frontend to seamlessly interoperate with the navigation structure of the existing `corva-web`.

* Modify `corva-web` layouts and views to use the new frontend.
* Modify `corva-web` routing configuration to support the new frontend navigation (HTML5 pushState).
* Support old-style well pages.
* Support old-style user settings pages.
* Support old-style static pages.

![](mockups/config.png)

## Adding A Widget

Adds capability for a user to add widgets to Dashboards and Well pages.

* Listing available widget types.
* Adjusting the Widget settings. (Rig, other common and widget-specific settings)
* Persisting the addition to the Dashboards API.

![](mockups/add_widget_list.PNG)

![](mockups/add_widget.PNG)

## Removing A Widget

Adds capability for a user to remove a widget from their Dashboard or Well page.

* Persisting the removal to the Dashboards API.

## Widget Settings

Adds capability for a user to change the settings of a widget that they have previously added.

* Should use the same settings feature as already implemented in "Adding A Widget".
* Adjusting the Widget settings. (Rig, other common and widget-specific settings)
* Persisting the addition to the Dashboards API.

![](mockups/widget_settings.PNG)

## Dashboard Management

Adds capability for users to to manage multiple dashboards.

* UI support for multiple dashboards in navigation.
* Create a dashboard.
* Delete a dashboard.
* Rename a dashboard.

## Widget Loading States

Most widgets will need to load data. While data is loading, some loading/progress indication needs to be shown to the user. Add a capability for doing this in a consistent way across widget types, so this does not needs to be implemented for every widget.

* Loading indication support in the widget API.
* UI design and implementation for the loading state.

## Full-Screen Widgets

Adds a capability for users to expand any widget to full-screen mode.

* Must also be linkable, i.e. a URL that points directly to a full-screen widget. Supports opening a widget to another browser tab/window.

![](mockups/fullscreen.png)

## Fully-Featured T&D Broomstick

Extend the simplistic T&D Broomstick widget to contain all the features that it will have.

**Needs further specification**

## Bootstrap Theme

Adds capability for using Bootstrap (react-bootstrap) components in widgets without
needing significant CSS styling every time.

* Evaluate existing themes to see if there is one that can be used as basis.
* Based on evaluation, either adapt an existing theme or create one from scratch.

## Rig Listings

Adds the capability for users to list rigs, wells, and drilling programs, and to navigate to them.

**Needs further specification**

## Well Alerts Bar

Adds the capability for users to see alerts on the well pages.

**Needs further specification**

## Analytics Dashboards

**Needs further specification**

## Search

Adds the capability for users to search for rigs and wells.

**Needs further specification**

## Engagement Tracking

Adds the capability for Corva to track what users are doing in the system.

* Evaluate tracking service options (Google Analytics, others.)
* Specify and implement tracking for the interactions we want to track.
  * E.g. on top of basic navigation tracking, track interaction with widgets.

## Raw Traces

Shows the raw values, supports zoom, scroll, and customization.
This is also where we need a socket to stream in live data.
Considered to be a component so a subset of the traces can be embedded in other views.

![](mockups/traces.png)

![](mockups/mobile_warning_scrolled.PNG)

## Dashboard Sharing

Adds the capability for users to search with other users the dashboard they have made.

**Needs further specification**

## Messages / Chat

**Needs further specification**
 
http://josephndungu.com/tutorials/gmail-like-chat-application-in-ruby-on-rails

## Third-Party Widget Integration

Adds the capability for Corva customers to integrate widgets of their own making into dashboards.

* Options include light-weight iframe integration of arbitrary HTML content, and deeper integration of actual JavaScript widgets that conform to a specific JavaScript API. Different options have different tradeoffs.

**Needs further specification**

## Native Mobile App Integration

Adds the capability for widgets to be displayed in WebViews inside native mobile applications.

**Needs further specification**

![](mockups/TAD_mobile.PNG)

![](mockups/mobile_warning.PNG)

![](mockups/mobile_warning_scrolled.PNG)
