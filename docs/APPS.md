# App Authoring Guide

## Concepts

### UI Apps and Control Apps

There are two kinds of Apps supported by the system:

* Most apps will be **UI Apps**, that are used to display (potentially real-time) data. These are apps that are displayed on Dashboards and Asset Pages, and that users are able to add, remove, and configure from their own UI.
* Some apps are **Control Apps**, that are used to control the contents of other apps. An example of this is a time period selector / timeline component. Control apps cannot be added or removed by users, and are instead automatically attached to Asset Pages, based on the current asset type.

### UI App Types, App Sets, and Apps

For UI Apps, the system supports several **App Types**, each one with their own functionality and visual representation. Each App Type has: 

* A *category* (e.g. "torqueAndDrag") to which the app type belongs.
* A *name* (e.g. "torqueAndDragBroomstick") that uniquely identifies the app within its category. 
* A *title* (e.g. “Trend Broomstick”) - used in titles and lists.
* An optional *subtitle* (e.g. "Visual trend identification for hole problems or poor cleaning") - used in titles.

A user can create a **App** by choosing a App Type and placing it into an **App Set**. Each App has:

* An *AppType* - that determines what the app is
* A *position* and *size* within the set
* A number of *settings*
	* The *asset* that data is pulled from
	* A *refresh rate* that determines how often the app updates its data
	* Other arbitrary settings depending on the app type (e.g. chart colors)

An App Set is a collection of these Apps, all displayed on the screen at the same time. An App Set is either a **Dashboard** (a set of apps showing data collected from multiple rigs) or a  **Asset Page Tab** (a set of apps from a specific category showing data from a single asset).

A **Dashboard App Set** represents a page with an app set that is not itself tied to any specific asset but instead has a collection of apps that may pull data from different assets. When a user adds an app to a dashboard, they choose an asset to pull data from.

Each Dashboard <has:></has:>

* A *Name*  - used in titles and lists
* An *Owner* - the user who owns the dashboard

An **Asset Page Tab App Set** represents a page with an app set that is tied to a specific asset. All apps on the page pull data from the same asset. Each Asset Page Tab has:

* A *Category* (e.g. “Torque & Drag”) that defines the category of apps the page holds. May be null/undefined, which means it is an “Overview” page for which any type of apps may be included.
* An *Owner* - the user who owns the page.

## Implementation

*Apps* in this application are self-contained UI elements provide the user a specific piece of information and functionality. Examples: "Torque And Drag Broomstick", "Wellbore Stability".

Several apps are shown on the screen simultaneously. UI Apps are laid out in an *app grid* (implemented using [react-grid-layout](https://www.npmjs.com/package/react-grid-layout)). The user may customize the number, order, and positions of apps in the grid. This means apps must be designed to accomodate flexible sizing. The user may also display individual apps in full-screen mode. 

Control apps are not laid out in a grid, but are expected to handle their own visual representation using CSS. A typical control app uses fixed positioning to pin itself in the browser viewport.

Every app is automatically subscribed to receive data when it is mounted on the screen. This means that apps do not need to do anything to receive their data, they will just be given it as an input property (`data`). When the page is configured to receive real-time data from `corva-subscriptions`, this property will also automatically receive new data whenever it is produced. Apps can, however, also make additional API requests if they have a need for custom API access. See below for more information.

## Simple Apps

Every app consists of at least one React component. Add this component and its supporting files to its own subfolder under `src/apps`.

* `src`
  * `apps`
    * `myApp`
      * `index.js`
      * `MyApp.css`
      * `MyApp.js`

Export the app's main component from the `index.js` file in the default export, so that the app can be easily imported to the grid:

`src/apps/myApp/index.js`

    import MyApp from './MyApp';

    export default {AppComponent: MyApp};

The main React component is the app's "public API". The app may have any number of subcomponents, helper functions, and other internal code, but all of that is an internal concern of the app.

Every app, both UI and control, is registered in to `appRegistry.js`. It is from this registry that the rest of the application finds the apps.

## App Props

Every UI app may expect to get the following input props:

* `assetId` - `number`
* `data` - An app-specific Immutable.js data structure of the latest data from the app's subscription.
* `size` - {`Size.SMALL`, `Size.MEDIUM`, `Size.LARGE`, `Size.XLARGE`} - the size the app is currently occupying in the grid. Can be used for responsive rendering.
* `widthCols` - number - the current number of columns the app is occuping in the widget grid. Apps *should* use `size` for their responsive rendering istead of `widthCols`, but `widthCols` can be useful to react to resizing using `componentWillReceiveProps`.
* The current values of any *app settings* supported by the app will be received as props as well. (See below).
* Additionally, UI apps will receive as props all parameters from the location query string. These are typically populated from control apps.

Every control app may expect to get the following input props:

* `asset` - An Immutable Map representing the asset that is being shown.
* `onUpdateParams` - `function` - a callback prop that the control app is given when it wants to update the page parameters. The callback takes one arguments, which is an object of parameter keys and values. When a control app wants to remove a parameter, it should include it in the object with a `null` value.
* Additionally, control apps will receive as props all parameters from the location query string. These are typically populated from control apps. This means any params that the control app sets using `onUpdateParams` are reflected back to it as props.

For example, if a control app calls `onUpdateParams({time: '2016-12-31'})`, a query parameter `?time=2016-12-31` will appear for the current page URL. (This means all parameters set by control apps are bookmarkable and linkable.) The parameter is then fed to all UI and control apps on the page - they will all receive a `time` prop whose value is `2016-12-31`.

**Note:** The `time` parameter is also a special case, since when it is present, UI apps will *not* be subscribed to real-time data. Instead, the data is assumed to be historical, non-realtime data, which is just fetched from `corva-api`. This allows a control app to switch all the UI apps on the screen between historical and live data: When you want historical data, set the `time` parameter with a ISO-8601 timestamp. When you want real-time data, don't set the `time` parameter (or re-set it to `null`).

## UI App Settings

For any app instances on Dashboards or Asset Page Tabs, the user may configure *settings* by opening a settings dialog. The dialog will contain some common settings (such as the active asset on Dashboard apps), byt app types may also specify their own settings editors for app-specific configurations. An example of this is the graph colors in the T&D Broomstick app.

To add one or more setting editors for an app type, add an array for them into the app type's `index.js`. The value should be an Immutable List of the setting editors supported by the app type:

`src/apps/myApp/index.js`

    export default {
      AppComponent: MyApp,
      settingsEditors: List([
        Map({
          name: 'graphColors',
          title: 'Graph Colors',
          required: false,
          Editor: GraphColorsSettingEditor
        })
      ]),
      constants
    };

Each entry in the list should be an Immutable Map with three keys:

* `name` - The name of the setting property. This will match the property name passed to the main app component.
* `title` - The human-readable name of the setting. This will be used as a heading in the settings dialog.
* `required` - Whether this setting is required by the app to function or not. For settings that are required, the user will be asked to provide a value when they add the app to their dashboard.
* `Editor` - A React component that allows the user to modify the setting value. This will be rendered into the settings dialog. The component will receive three input props:
   * `currentValue` - The current setting value. May be `undefined` if the user hasn't chosen anything yet.
   * `onChange` - A callback that the component should invoke when the user changes the value. Called with one argument, which is the new setting value.
   * `appType` - The app type object (formed from the values of `index.js` of the current app type). This may be useful for settings editors that are shared by multiple app types but may still need to behave differently for different app types.

For any setting editors configured this way, once the user has chosen settings for them, they will be received as input props by the main app component.

## Understanding A UI App's Surrounding Context

Each UI app is parented by a `AppContainer` component. That component is responsible for initiating and destroying the app's real-time subscription when the app is mounted or umounted or when its properties change so that it needs to subscribe to a different real-time feed. `AppContainer` also provides the surrounding UI that's common to all apps. 

`AppContainer`s in turn are laid out in a `AppGrid` component, which handles the visual positioning of apps on the screen, and the repositioning and resizing of apps.

Both `AppContainer` and `AppGrid` are presentational components that don't connect to the Redux store directly. Instead everything is given to them as input props. The connection to Redux happens one layer above, in a `Dashboard` or `AssetPage` component. These components act as the "smart components" that connect apps and grids to Redux.

* `Dashboard`
  * `AppGrid`
    * `AppContainer`
      * `SomeApp`
    * `AppContainer`
      * `SomeOtherApp`
    * `AppContainer`
      * `ThirdApp`
* `AssetPage`
  * `AppGrid`
    * `AppContainer`
      * `SomeApp`
    * `AppContainer`
      * `SomeOtherApp`
    * `AppContainer`
      * `ThirdApp`

## Redux Apps

When an app has nontrivial logic inside it, it is recommended to use Redux to implement that logic and the associated state management.

The app architecture allows making any app its own "mini Redux application", with its own state, reducer function, and actions. This Redux architecture is an adaptation of Jack Hsu's excellent [Rules For Structuring Redux Applications](http://jaysoo.ca/2016/02/28/organizing-redux-application/). (This is recommended reading.)

To make a Redux-enabled app, first set up its actions and action types:

`src/apps/myApp/actions.js`

    export const INCREMENT = 'myApp/INCREMENT';
    function increment() {
      return {type: t.INCREMENT};
    }

    export const DECREMENT = 'myApp/DECREMENT';
    function decrement( {
      return {type: t.DECREMENT};
    }

Note that action type strings must be prefixed as they need to be unique in the whole application.

Then you can create the app's reducer function:

`src/apps/myApp/reducer.js`

    import { Map } from 'immutable';
    import * as t from './actions';

    const initialState = Map({count: 0});

    export default function(state = initialState, action) {
      switch (action.type) {
        case t.INCREMENT:
          return state.update('count', c => c + 1);
        case t.DECREMENT:
          return state.update('count', c => c - 1);
        default:
          return state;
      }
    };

This reducer must then be integrated in the application's root reducer. We need a unique "namespace" for the app inside the global application state structure. For this purpose, create a `constants.js` file that contains a "name" for the app. It'll be used in side the app state:

`src/apps/myApp/constants.js`

    export const NAME = 'myApp';

Export the name in the app's public API (`index.js`), and also export the reducer function:

`src/apps/myApp/constants.js`

    import MyApp from './MyApp';
    import * as constants from './constants';
    import reducer from './reducer';

    export default {
      AppComponent: MyApp,
      constants,
      reducer
    };

This is now something we can mount on to the root reducer:

`src/rootReducer.js`

    import { combineReducers } from 'redux';

    import myApp from './apps/myApp';

    export default combineReducers({
      [myApp.constants.NAME]: myApp.reducer
    });


At this point the reducer (along with its state) is integrated to the application's Redux store. It may be integrated into the app component with the `connect` function of `react-redux`. But before we do that, it is recommended to add an additional `selectors.js` file, which contains *selectors* that pick out parts of the state that the component is interested in. This way the component does not need to know too much about the state shape:

`src/apps/myApp/selectors.js`

    import { flow } from 'lodash';
    import { NAME } from './constants';

    const getAppState = state => state[NAME];

    export const getCount = flow(getAppState, s => s.get('count'));


Now we can connect the state to the component. We can not only bind selectors as component input props, but also dispatch actions that will be handled by the reducer:

`src/apps/myApp/MyApp.js`

    import React, { Component } from 'react';
    import { connect } from 'react-redux';
    import { createStructuredSelector } from 'reselect';
    import { increment, decrement } from './actions';
    import { getCount } from './selectors';

    import './MyApp.css'

    class MyApp extends Component {

      render() {
        return (
          <div className="c-my-app">
            <button onClick={this.props.dispatch(decrement())}>-</button>
            {this.props.count}
            <button onClick={this.props.dispatch(increment())}>+</button>
          </div>
        );
      }

    }

    export default connect(
      createStructuredSelector({
        count: getCount
      })
    )(MyApp);

## API Access

Apps that need to load data from the server may do so using the server access functions in `src/api.js`. New data access functions may be added there as needed.

Very simple apps may call the API functions directly from the component (e.g. from its `componentDidMount` lifecycle hook), but for nontrivial components it is recommended that this is done through the Redux app architecture as described above.

1. Make API calls from action creators. The project contains the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware that makes this easy to do.
2. Track the loading state as well as the response data in the application store. Bind the state and date to components using the selector mechanism described above.

## Shared Components

TBD

## Unit Tests

TBD
