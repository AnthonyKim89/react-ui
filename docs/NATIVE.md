# Integration With Native Apps

Both `corva-api` and `corva-web-frontend` are designed to accommodate web-native-hybrid mobile app usage. Native mobile applications may authenticate to `corva-api` and make API calls to it, but they may also pull in content from `corva-web-frontend` into WebView components. This document describes how.


![](mockups/TAD_mobile.PNG)

![](mockups/mobile_warning.PNG)

![](mockups/mobile_warning_scrolled.PNG)

## Authentication From Mobile Apps

Native apps are expected to implement their own login  functionality, perusing the authentication endpoint of `corva-api`, documented in `API.md`. 

The API uses standard [JSON Web Token](https://jwt.io/) authentication. Upon a successful login, it returns a token that the native app must include in an `Authorization` header in all subsequent requests.

## API Access

Once the native app user is logged in and a JWT token has been obtained, the native app may make any API requests to `corva-api` on the user's behalf. The APIs are documented in `API.md` and implemented in `corva-api`.

## Navigation

Native apps are expected to render their own navigation UIs using the native components of each platform. This includes both top-level navigation and tab navigation within an Asset Page.

To build the necessary navigation UI, the native apps will require access to the following endpoints in `corva-api`:

* `GET /users/{userId}/app_sets/` - access to all the Dashboards as well as Asset Pages available to the current user. The *App Set* objects returned by this endpoint will all have one of two types:
   * `dashboard` - A Dashboard. Should be included in the app's navigation structure.
   * `asset_page_tab` - A tab in an Asset Page. Should be included in the tab structure of asset pages. The category of the page will be in the `category` field.
* `GET /assets` - access to Assets (e.g. wells) that the user has access to. Should be included in the app's navigation structure.

**Note:** We may divide the "App Set" concept to separate Dashboard and Asset Page objects. A discussion about how this should be modeled in `corva-api` is ongoing.

## Loading Content From `corva-web`

When a native app user has navigated to a Dashboard or a tab on an Asset Page, the native app should render a WebView component that loads the content for that page from `corva-web-frontend`. The WebView will include all the app instances contained on that page, as well as the settings of those apps. It will not, however, include any navigation or tab UIs.

The native app may load a Dashboard or an Asset Page to its WebView, e.g.

* `//[WEBDOMAIN]/dashboards/[dashboardId]` will load a dashboard. The `dashboardId` must match the id of a Dashboard object given by the API.
* `//[WEBDOMAIN]/assets/[assetId]/[category]` will load an asset page tab. The `category` must match the `category` field of an Asset Page given by the API.

The `[WEBDOMAIN]` here will be the production or test domain into which `corva-web-frontend` has been deployed. During development it may also be a locally hosted dev version of `corva-web-frontend`.

The native app must include two additional query parameters in the URL (they will not be seen by the user since the native app will not render a browser URL bar):

* `native=true`. This parameter will signal to `corva-web-frontend` that it should only render the contents of the current page, and *not* render any navigation structures or other webapp-specific UI affordances.
* `jwt=[JWT]`. This parameter will give `corva-web-frontend` the JWT token of the current user, which the native app has obtained at login. The webapp will use the token to make its own API requests and real-time result connections to `corva-subscriptions`.

During development, one or both of these parameters can also be provided manually into the local web browser URL bar for testing purposes, e.g. `http://localhost:3001/dashboards/1234?jwt=abcd&native=true`.

*Note:* The apps and their content will be automatically sized to fit the space available in the WebView, and no special effort should be required from the native app's side to accommodate different form factors.

## Programmatic Navigation

To move the application from one page to another within the WebView, there is a global `navigateAppTo` JavaScript function available. This may be useful when the same WebView is reused for multiple pages so that it doesn't need to fully reload each time:

    window.navigateAppTo('/dashboards/1234')

## Notification

On certain events, the JavaScript application will send a notification to the native application using a postMessage, with the pattern documented [here](http://www.joshuakehn.com/2014/10/29/using-javascript-with-wkwebview-in-ios-8.html). The native web view should attach a message handler with the key `swiftHandler`. It will be called on these events

* Once the web application has finished loading the dashboard contents: `pageLoaded`.
* When any app is maximized on the screen: `appMaximized`.
* When a previously maximized app is restored back to its original size: `appRestored`.
