# Widget Authoring Guide

*Widgets* in this application are self-contained UI elements provide the user a specific piece of information and functionality. Examples: "Torque And Drag Broomstick", "Wellbore Stability".

Several widgets are shown on the screen simultaneously, laid out in a *widget grid*. The user may customize the number, order, and positions of widgets in the grid. This means widgets must be designed to accomodate flexible sizing. The user may also display individual widgets in full-screen mode.

## Understanding The Widget's Context

Each widget is parented by a `WidgetContainer` component. That component provides the widget its props as well as the UI box that's common to all widgets. `WidgetContainer`s in turn are laid out in a `WidgetGrid` component.

## CSS & Bootstrap Components

## API Access

## Unit Tests
