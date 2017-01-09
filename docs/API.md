# API Integration with corva-web

This frontend project fetches all data from APIs provided by the `corva-web` project. All data is in JSON format.

## Endpoints

On `corva-api` the code for the endpoints are / should be under `app/controllers/v1`, in small focused controllers and views.

### Authentication

#### Login

##### Request

    POST /user_token
    {"auth": {"email": "user@user.com", "password": "abcd"}}

##### Response

    {"jwt": "abcd"}

### Users

#### Current User

Returns information about the currently signed-in user.

##### Request

   GET /users/current

##### Response

    {
      "id": 1234
    }

### Assets

Returns information about assets (rigs, wells, programs...)

#### List

##### Request

   GET /assets

   GET /assets?type[]=rig&type[]=well

##### Response

   [
     {
       "id": 1,
       "name": "A Rig",
       "type": "rig",
       "status": "drilling",
       "date": "2017-01-01T00:00:00"
     },
     {
       "id": 2,
       "name": "A Well",
       "type": "well",
       "status": "drilling",
       "date": "2017-01-01T00:00:00"
     }
   ]

#### Show

##### Request

    GET /assets/1

##### Response

    {
      "id": 1,
      "name: "A Rig",
      "type: "rig"
    }

##### Show Active Child

For assets that have children, one of which should be considered the "active" one, return
that child. Used for the active wells of rigs.

##### Request

    GET /assets/1/active_child

##### Response

    {
      "id": 2,
      "name: "A Well",
      "type: "well"
    }

### Apps And App Sets

#### List

Returns a list of all the app sets (Dashboards and Asset Page Tabs) that the user has access to.
The response should contain all the contents of the apps as well, so that the frontend
navigation can be fully populated based on it.

##### Request

   GET /users/{userId}/app_sets/

##### Response

    [
      {
        "id": 1234,
        "type": "dashboard",
        "name": "My Dashboard",
        "apps": [{
          "id": 5678,
          "category": "torque_and_drag",
          "name": "broomstick",
          "coordinates": {"x": 0, "y": 0, "w": 3, "h": 5},
          "settings": {"rig_id": 7890, "other": "settings"}
        }]
      },
      {
        "id": 5678,
        "type": "asset_page_tab",
        "category": "torque_and_drag",
        "apps": [{
          "id": 9012,
          "category": "torque_and_drag",
          "name": "broomstick",
          "coordinates": {"x": 0, "y": 0, "w": 3, "h": 5},
          "settings": {"some": "settings"}
        }]
      }
    ]

#### Create App

Create an app with settings, coordinates, and type

##### Request

   POST /users/{userId}/app_sets/{appSetId}/apps

   {
     "category": "torque_and_drag",
     "name": "broomstick",
     "coordinates": {"x": 0, "y": 0, "w": 3, "h": 5},
     "settings": {"rig_id": 7890, "other": "settings"}
   }

##### Response

   {
     "id": 5678,
     "category": "torque_and_drag",
     "name": "broomstick",
     "coordinates": {"x": 0, "y": 0, "w": 3, "h": 5},
     "settings": {"rig_id": 7890, "other": "settings"}
   }

#### Update App

Updates the settings, coordinates, or type of an existing app

##### Request

   PUT /users/{userId}/app_sets/{appSetId}/apps/{appId}

   {
     "id": 5678,
     "category": "torque_and_drag",
     "name": "broomstick",
     "coordinates": {"x": 0, "y": 0, "w": 3, "h": 5},
     "settings": {"rig_id": 7890, "other": "settings"}
   }

##### Response

   {
     "id": 5678,
     "category": "torque_and_drag",
     "name": "broomstick",
     "coordinates": {"x": 0, "y": 0, "w": 3, "h": 5},
     "settings": {"rig_id": 7890, "other": "settings"}
   }


### App Results

Returns result data for applications to display (e.g.. the broomstick chart data for the T&D broomstick)

#### Show

##### Request

   GET /apps/:appTypeCategory/:appTypeName/results/:assetId

   GET /apps/:appTypeCategory/:appTypeName/results/:assetId?time=2017-01-01T00:00:00

##### Response

The response contents are application-specific.
