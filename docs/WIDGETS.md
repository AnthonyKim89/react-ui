# Widget Authoring Guide

*Widgets* in this application are self-contained UI elements provide the user a specific piece of information and functionality. Examples: "Torque And Drag Broomstick", "Wellbore Stability".

Several widgets are shown on the screen simultaneously, laid out in a *widget grid*. The user may customize the number, order, and positions of widgets in the grid. This means widgets must be designed to accomodate flexible sizing. The user may also display individual widgets in full-screen mode.

## Widget Structure

Every widget consists of at least one React component. This component and its supporting files should reside in its on subfolder under `src/widget`.

* `src`
** `widget`
*** `torque-and-drag-broomstrick`
**** `index.js`
**** `TorqueAndDragBroomstickWidget.css`
**** `TorqueAndDragBroomstickWidget.js`

Export the component from the `index.js` file in the subfolder, so that the widget can be easily imported to the grid:

`src/widget/torque-and-drag-broomstick/index.js`
```
import TorqueAndDragBroomstickWidget from './TorqueAndDragBroomstickWidget';

export default TorqueAndDragBroomstickWidget;
```

## Input Props

Every widget may expect to get the following input props:

* `jobId` - `number`
* `time` - `moment` - the selected time

## Understanding The Widget's Surrounding Context

Each widget is parented by a `WidgetContainer` component. That component provides the widget its input props as well as the UI box that's common to all widgets. `WidgetContainer`s in turn are laid out in a `WidgetGrid` component:

* `WidgetGrid`
** `WidgetContainer`
*** `SomeWidget`
** `WidgetContainer`
*** `SomeOtherWidget`
** `WidgetContainer`
*** `ThirdWidget`

## CSS & Bootstrap Components

## Shared Components

## API Access

## Unit Tests
