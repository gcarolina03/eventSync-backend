# EventSync

EventSync is the backend application that simplifies the process of searching for event services, creating events, managing reservations, and keeping track of event budgets. With EventSync, you can effortlessly plan and organize your events, ensuring a seamless experience for both event organizers and service providers.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage and Endpoints](#usage-and-endpoints)
- [Data Model](#data-model)
- [Author](#author)
- [Technologies Used](#technologies-used)
- [Project Link](#project-link)
- [License](#license)


## Prerequisites

To run this application, make sure you have the following:

- Mongo database installed and configured.


## Installation

1. Clone the repository
1. Install the required packages: **`npm i`**
3. Create a **`.env`** file based on the provided **`.env.example`** file. Specify the values for the environment variables required by the application to work.

## Usage and Endpoints

Here are some usage examples to get you started:

- 

- 

- 


Feel free to explore the application and experiment with different features.


| Endpoint             | Request           | Description                                                   | Role                 |
|----------------------|-------------------|---------------------------------------------------------------|----------------------|
| `/api/auth/signup`   | POST              | Creates a new user account and generates a session to         | Guest                |
| `/api/auth/login`    | POST              | Authenticates user credentials and generates a session token  | Guest                |
| `/api/profile`       | GET               | Fetches details of log in user                                | User                 |
| `/api/events`        | GET               | Fetches a list of all events                                  | User                 |
| `/api/events/:id`    | GET               | Fetches details of a specific event                           | User                 |
| `/api/events`        | POST              | Creates a new events                                          | User                 |
| `/api/events/:id`    | DELETE            | Deletes a specific event                                      | User                 |
| `/api/cities`        | GET               | Fetches a list of all cities                                  | User                 |
| `/api/cities`        | POST              | Creates a new city                                            | Admin                |
| `/api/categories`    | GET               | Fetches a list of all categories                              | User                 |
| `/api/categories`    | POST              | Creates a new category                                        | Admin                |


## Data Model

### Collection "users" 
| Column        | Type                    |
| ------------- | ----------------------- |
| _id           | ObjectId (Primary Key)  |
| first_name*   | String                  |
| last_name     | String                  |
| email*        | String (Unique)         |
| password*     | String                  |
| img_url       | String                  |
| eventsCreated | ObjectId (ref: event)   |
| role          | String                  |


### Collection "events" 
| Column        | Type                    |
| ------------- | ----------------------- |
| _id           | ObjectId (Primary Key)  |
| userId*       | ObjectId (ref: users)   |
| title*        | String                  |
| event_date    | Date                    |
| start_time    | String                  |
| end_time      | String                  |
| total_price   | Number (float)          |
| img_url       | String                  |


### Collection "cities" 
| Column        | Type                    |
| ------------- | ----------------------- |
| _id           | ObjectId (Primary Key)  |
| name*         | String                  |
| postal_code*  | Number (Unique)         |
| country*      | String                  |


### Collection "categories" 
| Column        | Type                    |
| ------------- | ----------------------- |
| _id           | ObjectId (Primary Key)  |
| title*        | String                  |


### Collection "services" 
| Column        | Type                        |
| ------------- | --------------------------- |
| _id           | ObjectId (Primary Key)      |
| userId*       | ObjectId (ref: users)       |
| title         | String                      |
| categoryId*   | ObjectId (ref: categories)  |
| cityId*       | ObjectId (ref: cities)      |
| max_capacity  | Number                      |
| min_capacity  | Number                      |
| img_url       | String                      |
| price*        | Number (float)              |

## Author

EventSync is being created by:

- Carolina (https://github.com/gcarolina03)


## Technologies Used

This project is being built using:

- JavaScript
- Mongoose
- Express


## Project Link

You can find the project on GitHub at: https://github.com/gcarolina03/eventSync-backend


## License

This project is licensed under the [MIT License](LICENSE).