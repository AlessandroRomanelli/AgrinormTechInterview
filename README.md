# Agrinorm Assignment - Task Management

For this assignment, you will be implementing a new UI so that our customers can more easily manage their work. 
In particular, the quality inspection of batches in their stock (warehouse). 

A batch consists of X boxes of fruits. The following information can be relevant for the inspectors:
* Fruit name (e.g. Avocado)
* Variety (e.g Hass)
* Timestamp of arrival into the warehouse  
* **Latest** quality inspection information
  * Inspection timestamp 
  * Quality scores in some scale (e.g. A, B, C, D)

Our customers have two types of users:

* **Quality Managers**: Responsible for creating new inspection tasks and assigning them to **Quality Inspectors**
* **Quality Inspectors**: Responsible for performing quality inspections themselves.

At this point, the backend has been provided for you so you will only need to worry about the frontend.\

Your solution should fulfill the following requirements:
* As a quality manager, I should be able to:
    1. Create a new inspection ‘task’
    2. Assign a ‘task’ to a quality inspector
    3. Review ‘task’ assignments (i.e. which tasks have been assigned to which inspector)
* As a quality inspector, I should be able to:
    1. Review which tasks have been assigned to me
    2. Change the status of a task. Tasks can be in one of three statuses: `TODO`, `IN_PROGRESS`, or `DONE`
   
Additionally your solution can support: 
1. Filtering tasks by different fields, e.g. fruit name, latest quality score, etc.
2. Ordering tasks by relevant fields, such as days since last inspection

Please note:
1. We are more interested in the UI itself, and less interested in the functionality for this task
2. Feel free to use any data model that supports your solution

## Development

First run `npm i` to setup the project. Then within the project directory, you can run:

### `npm run api`

Starts the API on port `3001`. You should run this before running `npm start` so that the data and API endpoints are accessible.\
This data is served from [json-server](https://www.npmjs.com/package/json-server) \
and you can inspect the current DB data which the API serves by looking in the `db.json` file.

The contents of `db.json` will change if you call `POST/PUT/DELETE` operations on the API.

#### API Endpoints

The API has three resources:

1. /inspectors
2. /batches
3. /tasks

Data can be read/written for each of these resources via standard REST operations.\

**Examples**:
* `curl -X 'GET' 'http://localhost:3001/inspectors'` returns a list containing all of the inspector information
* `curl -X POST -H "Content-Type: application/json" -d '{"inspectorId": 3,"batchId": 4,"status": "TODO"}' "http://localhost:3001/tasks"` will create a new task for inspector 3 to inspect batch 4

#### Backup data

The API is very simple and does very basic data validation (e.g. checking for duplicate IDs). If you accidentally add bad data to the DB, you can modify the data in `db.json` manually, or you can find a copy of the initial data in `db.json.bak`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.