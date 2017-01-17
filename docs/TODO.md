This list is assumed to be in priority order. Next work items will be taken from
the top of the list unless agreed otherwise.

## Asset Listings & Navigation

Adds the capability for users to list rigs, wells, and drilling programs, and to navigate to them.

![](mockups/wells.png)

![](mockups/wells_menu.png)

## Raw Traces

Shows the raw values, supports zoom, scroll, and customization.
This is also where we need a socket to stream in live data.
Considered to be a component so a subset of the traces can be embedded in other views.

![](mockups/traces.png)

![](mockups/mobile_warning_scrolled.PNG)

## Synchronized Mouseover on charts

Support a UX feature where a use can mouseover on data points in graphs, and data points from the same time are also higlighted on other graphs.

## Dashboard Management

Adds capability for users to to manage multiple dashboards.

* UI support for multiple dashboards in navigation.
* Create a dashboard.
* Delete a dashboard.
* Rename a dashboard.

## Full-Screen Apps

Adds a capability for users to expand any app to full-screen mode.

* Must also be linkable, i.e. a URL that points directly to a full-screen app. Supports opening a app to another browser tab/window.

![](mockups/fullscreen.png)

## Fully-Featured T&D Broomstick

Extend the simplistic T&D Broomstick app to contain all the features that it will have.

**Needs further specification**

## Fully-Featured Well Timeline with Real Data

Ryan:

> We will need a method to gather the data for the well timeline. Since we are moving to Cassandra, I think we will create a summary cache that suits our timeline. For example, if we collect in 1 second increments, the summary will aggregate for every 1 minute, 5 min, 1 hour, etc
ActivityGroupItem = "Drilling" or "Tripping In" - it's an larger value of activity states. We will put this in the WitsRecord in the future so everything is in 1 record. We need a query method to get this 
data. TBD.

## Bootstrap Theme

Adds capability for using Bootstrap (react-bootstrap) components in apps without
needing significant CSS styling every time.

* Evaluate existing themes to see if there is one that can be used as basis.
* Based on evaluation, either adapt an existing theme or create one from scratch.

Use IBM Bluemix as an inspiration.

![](mockups/well_tad.PNG)

## UI Motion

Many UI interactions could use some animated transitions for a smoother experience:

* Opening dialogs, like add app, app settings.
* Navigating between pages and tabs.
* Opening and closing hover menus.
* Filtering lists / search results

## Depth vs. Time Chart for Well Timeline

In addition to the basic well page timeline already implemented, the mockup contains a "depth vs time" chart displayed above it:

![](mockups/timeline.png)

## Well Alerts Bar

Adds the capability for users to see alerts on the well pages.

**Needs further specification**

## Analytics Dashboards

**Needs further specification**

## Engagement Tracking

Adds the capability for Corva to track what users are doing in the system.

* Evaluate tracking service options (Google Analytics, others.)
* Specify and implement tracking for the interactions we want to track.
  * E.g. on top of basic navigation tracking, track interaction with apps.


## Dashboard Sharing

Adds the capability for users to search with other users the dashboard they have made.

**Needs further specification**

## Messages / Chat

**Needs further specification**
 
http://josephndungu.com/tutorials/gmail-like-chat-application-in-ruby-on-rails

## Third-Party App Integration

Adds the capability for Corva customers to integrate apps of their own making into dashboards.

* Options include light-weight iframe integration of arbitrary HTML content, and deeper integration of actual JavaScript apps that conform to a specific JavaScript API. Different options have different tradeoffs.

**Needs further specification**

