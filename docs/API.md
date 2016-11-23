# API Integration with corva-web

This frontend project fetches all data from APIs provided by the `corva-web` project. All data is in JSON format.

## General Guidelines

As far as practical, there should be one API endpoint for each different widget supported by the frontend. That endpoint should server whatever the widget needs and optimally would not have any extra data or parameters on top of that.

This is not a 100% hard requirement though: Some widgets may need to make more than one API call to get what they need. Some APIs may be called for several widgets.

Since the frontend will be run on many different kinds of devices and not all of them will be high-end, we should strive to *minimize the amount of data processing done client-side*. This means that the server should, as much as possible, return data in a format that's conveniently usable in the frontend without heavy processing. For example, chart data should be provided in data series that can be shown in charts with any numeric parsing and conversions already done. 

On the other hand, we want to retain the flexibility to change the way data is visualized on the frontend without requiring extensive API changes. For this reason the API should be defined in terms of the data content only, and not concern itself with UI implementation details (e.g. chart types, colors)

## Endpoints

On `corva-web` the code for the endpoints are / should be under `app/controllers/api/v1`, in small focused controllers and views.

### Users

#### Current User

Returns information about the currently signed-in user.

##### Request

   GET /api/users/current

##### Response

    {
      "id": 1234
    }

### Widget Grids

#### List

Returns a list of all the widget grids (Dashboards and Well Pages) that the user has access to.

##### Request

   GET /api/users/{userId}/widget_sets/

##### Response

    [
      {
        "id": 1234,
        "type": "dashboard",
        "name": "My Dashboard",
        "widgets": [{
          "id": 5678,
          "type": "torque_and_drag/broomstick",
          "coordinates": {"x": 0, "y": 0, "w": 3, "h": 5},
          "settings": {"rig_id": 7890, "other": "settings"}
        }]
      },
      {
        "id": 5678,
        "type": "well_page",
        "category": "torque_and_drag",
        "widgets": [{
          "id": 9012,
          "type": "torque_and_drag/broomstick",
          "coordinates": {"x": 0, "y": 0, "w": 3, "h": 5},
          "settings": {"some": "settings"}
        }]
      }
    ]

### Torque And Drag Broomstick Charts

#### Request

   GET /api/jobs/{wellId}/torque_and_drag/broomstick_chart

Query parameters

* `date` - the date/time as a Unix timestamp (seconds since epoch)

#### Response

    {
      "depth_unit": "e.g. ft",
      "load_unit": "e.g. klbf",
      "series": [
        {
          "title": "e.g. Predicted Slackoff (0.25)",
          "calculation": "predicted" | "actual",
          "type": "slackoff" | "rotating" | "pickup",
          "data": [
            {"measured_depth": 2000, "hookload": 100},
            {"measured_depth": 2300, "hookload": 120},
            {"measured_depth": 2400, "hookload": 132.5}
          ]
        }
      ]
    }