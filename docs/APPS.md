# App Authoring Guide

## Concepts

The system supports several **App Types**, each one with their own functionality and visual representation. Each App Type has: 

* A *category* (e.g. "torqueAndDrag") to which the app type belongs.
* A *name* (e.g. "torqueAndDragBroomstick") that uniquely identifies the app within its category. 
* A *title* (e.g. “Trend Broomstick”) - used in titles and lists.
* An optional *subtitle* (e.g. "Visual trend identification for hole problems or poor cleaning") - used in titles.

A user can create a **App** by choosing a App Type and placing it into a **App Set**. Each App has:

* An *AppType* - that determines what the app is
* A *position* and *size* within the set
* A number of *settings*
	* The *asset* that data is pulled from
	* A *refresh rate* that determines how often the app updates its data
	* Other arbitrary settings depending on the app type (e.g. chart colors)

An App Set is a collection of these Apps, all displayed on the screen at the same time. An App Set is either a **Dashboard** (a set of apps showing data collected from multiple rigs) or a  **Asset Page Tab** (a set of apps from a specific category showing data from a single asset).

A **Dashboard App Set** represents a page with an app set that is not tied to any specific rig but instead has a collection of apps that may pull data from different rigs. When a user adds an app to a dashboard, they choose a Rig to pull data from. Data will then be fetched from the *active well* of that rig.

Each Dashboard <has:></has:>

* A *Name*  - used in titles and lists
* An *Owner* - the user who owns the dashboard

An **Asset Page Tab App Set** represents a page with an app set that is tied to a specific asset. All apps on the page pull data from the same asset. Each Asset Page Tab has:

* A *Category* (e.g. “Torque & Drag”) that defines the category of apps the page holds. May be null/undefined, which means it is an “Overview” page for which any type of apps may be included.
* An *Owner* - the user who owns the page.

## Implementation

*Apps* in this application are self-contained UI elements provide the user a specific piece of information and functionality. Examples: "Torque And Drag Broomstick", "Wellbore Stability".
app
Several apps are shown on the screen simultaneously, laid out in an *app grid* (implemented using [react-grid-layout](https://www.npmjs.com/package/react-grid-layout)). The user may customize the number, order, and positions of apps in the grid. This means apps must be designed to accomodate flexible sizing. The user may also display individual apps in full-screen mode.

Every app is automatically subscribed to receive data from `corva-subscriptions` when it is mounted on the screen. This means that apps do not need to do anything to receive their data, they will just be given it as an input property, which also automatically updates whenever new data is received. Apps can, however, make additional API
requests if they have a need for custom API access. See below for more information.

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

## App Main Component Input Props

Every app may expect to get the following input props:

* `assetId` - `number`
* `data` - An app-specific Immutable.js data structure of the latest data from the app's subscription.
* `time` - `moment` - the selected time
* `size` - {`Size.SMALL`, `Size.MEDIUM`, `Size.LARGE`, `Size.XLARGE`} - the size the app is currently occupying in the grid. Can be used for responsive rendering.


## Understanding The App's Surrounding Context

Each app is parented by a `AppContainer` component. That component is responsible for initiating and destroying the app's real-time subscription when the app is mounted or umounted or when its properties change so that it needs to subscribe to a different real-time feed. `AppContainer` also provides the surrounding UI that's common to all apps. 

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
