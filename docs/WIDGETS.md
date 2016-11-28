# Widget Authoring Guide

## Concepts

The system supports several **Widget Types**, each one with their own functionality and visual representation. Each Widget Type has: 

* A *title* (e.g. “Trend Broomstick”) - used in titles and lists.
* An optional *subtitle* (e.g. "Visual trend identification for hole problems or poor cleaning") - used in titles.
* A *category* (e.g. “Torque & Drag”) - used in titles. Also used as a criteria for where widgets of this type can be added.

A user can create a **Widget** by choosing a Widget Type and placing it into a **Widget Set**. Each Widget has:

* A *WidgetType* - that determines what the widget is
* A *position* and *size* within the set
* A number of *settings*
	* The *well* that data is pulled from
	* A *refresh rate* that determines how often the widget updates its data
	* Other arbitrary settings depending on the widget type (e.g. chart colors)

A Widget Set is a collection of these Widgets, all displayed on the screen at the same time. A Widget Sets is either a **Dashboard** (a set of widgets showing data collected from multiple rigs) or a  **Well Page** (a set of widgets showing data from a single well).

A **Dashboard Widget Set** represents a page with a widget set that is not tied to any specific rig but instead has a collection of widgets that may pull data from different rigs. When a user pins a widget to a dashboard, they choose a Rig to pull data from. Data will then be fetched from the *active well* of that rig.

Each Dashboard <has:></has:>

* A *Name*  - used in titles and lists
* An *Owner* - the user who owns the dashboard

A **Well Page Widget Set** represents a page with a widget set that is tied to a specific well. All widgets on the page pull data from the same well. Each Well Page has:

* A *Category* (e.g. “Torque & Drag”) that defines the category of widgets the page holds. May be null/undefined, which means it is an “Overview” page for which any type of widgets may be included.
* An *Owner* - the user who owns the page.

The difference between **rig** and **well**: A rig drills a well. On a well page, the default widgets are tied to that well. On the dashboard, widgets are tied to a rig which means it shows the active well. The active well will change automatically

## Implementation

*Widgets* in this application are self-contained UI elements provide the user a specific piece of information and functionality. Examples: "Torque And Drag Broomstick", "Wellbore Stability".

Several widgets are shown on the screen simultaneously, laid out in a *widget grid* (implemented using [react-grid-layout](https://www.npmjs.com/package/react-grid-layout)). The user may customize the number, order, and positions of widgets in the grid. This means widgets must be designed to accomodate flexible sizing. The user may also display individual widgets in full-screen mode.

## Simple Widgets

Every widget consists of at least one React component. Add this component and its supporting files to its own subfolder under `src/widget`.

* `src`
  * `widget`
    * `myWidget`
      * `index.js`
      * `MyWidget.css`
      * `MyWidget.js`

Export the widget's main component from the `index.js` file in the default export, so that the widget can be easily imported to the grid:

`src/widget/myWidget/index.js`

    import MyWidget from './MyWidget';

    export default {Widget: MyWidget};

The main React component is the widget's "public API". The widget may have any number of subcomponents, helper functions, and other internal code, but all of that is an internal concern of the widget.

## Widget Main Component Input Props

Every widget may expect to get the following input props:

* `wellId` - `number`
* `time` - `moment` - the selected time
* `size` - {`Size.SMALL`, `Size.MEDIUM`, `Size.LARGE`, `Size.XLARGE`} - the size the widget is currently occupying in the grid. Can be used for responsive rendering.

## Redux Widgets

When a widget has nontrivial logic inside it, it is recommended to use Redux to implement that logic and the associated state management.

The widget architecture allows making any widget its own "mini Redux application", with its own state, reducer function, and actions. This Redux architecture is an adaptation of Jack Hsu's excellent [Rules For Structuring Redux Applications](http://jaysoo.ca/2016/02/28/organizing-redux-application/). (This is recommended reading.)

To make a Redux-enabled widget, first set up its actions and action types:

`src/widget/myWidget/actions.js`

    export const INCREMENT = 'myWidget/INCREMENT';
    function increment() {
      return {type: t.INCREMENT};
    }

    export const DECREMENT = 'myWidget/DECREMENT';
    function decrement( {
      return {type: t.DECREMENT};
    }

Note that action type strings must be prefixed as they need to be unique in the whole application.

Then you can create the widget's reducer function:

`src/widget/myWidget/reducer.js`

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

This reducer must then be integrated in the application's root reducer. We need a unique "namespace" for the widget inside the global application state structure. For this purpose, create a `constants.js` file that contains a "name" for the widget. It'll be used in side the app state:

`src/widget/myWidget/constants.js`

    export const NAME = 'myWidget';

Export the name in the widget's public API (`index.js`), and also export the reducer function:

`src/widget/myWidget/constants.js`

    import MyWidget from './MyWidget';
    import * as constants from './constants';
    import reducer from './reducer';

    export default {
      Widget: MyWidget,
      constants,
      reducer
    };

This is now something we can mount on to the root reducer:

`src/rootReducer.js`

    import { combineReducers } from 'redux';

    import myWidget from './widget/myWidget';

    export default combineReducers({
      [myWidget.constants.NAME]: myWidget.reducer
    });


At this point the reducer (along with its state) is integrated to the application's Redux store. It may be integrated into the widget component with the `connect` function of `react-redux`. But before we do that, it is recommended to add an additional `selectors.js` file, which contains *selectors* that pick out parts of the state that the component is interested in. This way the component does not need to know too much about the state shape:

`src/widget/myWidget/selectors.js`

    import { flow } from 'lodash';
    import { NAME } from './constants';

    const getWidgetState = state => state[NAME];

    export const getCount = flow(getWidgetState, s => s.get('count'));


Now we can connect the state to the component. We can not only bind selectors as component input props, but also dispatch actions that will be handled by the reducer:

`src/widget/myWidget/MyWidget.js`

    import React, { Component } from 'react';
    import { connect } from 'react-redux';
    import { createStructuredSelector } from 'reselect';
    import { increment, decrement } from './actions';
    import { getCount } from './selectors';

    import './MyWidget.css'

    class myWidget extends Component {

      render() {
        return (
          <div className="my-widget">
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
    )(MyWidget);

## API Access

Widgets that need to load data from the server may do so using the server access functions in `src/api.js`. New data access functions may be added there as needed.

Very simple widgets may call the API functions directly from the component (e.g. from its `componentDidMount` lifecycle hook), but for nontrivial components it is recommended that this is done through the Redux widget architecture as described above.

1. Make API calls from action creators. The project contains the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware that makes this easy to do.
2. Track the loading state as well as the response data in the application store. Bind the state and date to components using the selector mechanism described above.

See the `torqueAndDragBroomstick` widget for a concrete example on how this style of API access can be done.

## Shared Components

TBD

## Unit Tests

TBD

## Understanding The Widget's Surrounding Context

Each widget is parented by a `WidgetContainer` component. That component provides the widget its input props as well as the UI box that's common to all widgets. `WidgetContainer`s in turn are laid out in a `WidgetGrid` component:

* `WidgetGrid`
  * `WidgetContainer`
    * `SomeWidget`
  * `WidgetContainer`
    * `SomeOtherWidget`
  * `WidgetContainer`
    * `ThirdWidget`
T