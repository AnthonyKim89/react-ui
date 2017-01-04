This list is assumed to be in priority order. Next work items will be taken from
the top of the list unless agreed otherwise.

## Building For Deployment

Adds capability for the project to be built to production so that it can be deployed as part of `corva-web`.

* Modify frontend build configuration so that paths etc. are compatible.
* Integrate deployment with `corva-web` deployment process.

## Asset Listings & Navigation

Adds the capability for users to list rigs, wells, and drilling programs, and to navigate to them.

![](mockups/wells.png)

![](mockups/wells_menu.png)


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

## Dashboard Management

Adds capability for users to to manage multiple dashboards.

* UI support for multiple dashboards in navigation.
* Create a dashboard.
* Delete a dashboard.
* Rename a dashboard.

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

## Synchronized Mouseover on charts

Support a UX feature where a use can mouseover on data points in graphs, and data points from the same time are also higlighted on other graphs.

## Depth vs. Time Chart for Well Timeline

In addition to the basic well page timeline already implemented, the mockup contains a "depth vs time" chart displayed above it:

![](mockups/timeline.png)

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
  * E.g. on top of basic navigation tracking, track interaction with apps.

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

## Third-Party App Integration

Adds the capability for Corva customers to integrate apps of their own making into dashboards.

* Options include light-weight iframe integration of arbitrary HTML content, and deeper integration of actual JavaScript apps that conform to a specific JavaScript API. Different options have different tradeoffs.

**Needs further specification**

## Native Mobile App Integration

Adds the capability for apps to be displayed in WebViews inside native mobile applications.

**Needs further specification**

![](mockups/TAD_mobile.PNG)

![](mockups/mobile_warning.PNG)

![](mockups/mobile_warning_scrolled.PNG)



* Well timeline (Frontend, API/data tasks)
* Asset list/search views and asset navigation menus.
* Well Alerts
* Analytics Apps
* Engagement Tracking
* Dashboard sharing features
* Third-party app development support features (developing, uploading).


1. What is included in frontend "User Model"?
2. What is included in frontend "Overview Apps"?
3. Are "Hydraulics", "Efficiency", "Circulation", "Mud Motor", and "Directional" all app categories like "Torque and Drag"? 
