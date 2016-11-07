# API Integration with corva-web

This frontend project fetches all data from APIs provided by the `corva-web` project. All data is in JSON format.

## General Guidelines

As far as practical, there should be one API endpoint for each different widget supported by the frontend. That endpoint should server whatever the widget needs and optimally would not have any extra data or parameters on top of that.

This is not a 100% hard requirement though: Some widgets may need to make more than one API call to get what they need. Some APIs may be called for several widgets.

Since the frontend will be run on many different kinds of devices and not all of them will be high-end, we should strive to *minimize the amount of data processing done client-side*. This means that the server should, as much as possible, return data in a format that's conveniently usable in the frontend without heavy processing. For example, chart data should be provided in data series that can be shown in charts with any numeric parsing and conversions already done. 

On the other hand, we want to retain the flexibility to change the way data is visualized on the frontend without requiring extensive API changes. For this reason the API should be defined in terms of the data content only, and not concern itself with UI implementation details (e.g. chart types, colors)

## Endpoints

On `corva-web` the code for the endpoints are / should be under `app/controllers/api/v1`, in small focused controllers and views.

### Torque And Drag Broomstick Charts

#### Request

   GET /api/jobs/{jobId}/torque_and_drag_broomstick_chart

Query parameters

* `date` - the date/time as a Unix timestamp (seconds since epoch)

#### Response

    {
      "depth_unit": "e.g. ft",
      "load_unit": "e.g. klbf",
      "series": [
        {
          "title": "e.g. Predicted Slackoff (0.25)",
          "type": "predicted" | "actual",
          "measurement": "slackoff" | "rotating" | "pickup",
          "data": [
            {"depth": 2000, "load": 100},
            {"depth": 2300, "load": 120},
            {"depth": 2400, "load": 132.5}
          ]
        }
      ]
    }