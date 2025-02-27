# EventSync

EventSync is the backend application that simplifies the process of searching for event services, creating events, managing reservations, and keeping track of event budgets. With EventSync, you can effortlessly plan and organize your events, ensuring a seamless experience for both event organizers and service providers.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage and Endpoints](#usage-and-endpoints)
- [Data Model](#data-model)
- [Author](#author)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
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

- Use the search functionality to find event services.

- Create a new event by providing essential details such as the event title, date and time.

- Create a service profile by providing detailed information about the services you offer.


Feel free to explore the application and experiment with different features.


| Endpoint                         | Request           | Description                                                   | Role                 |
|----------------------------------|-------------------|---------------------------------------------------------------|----------------------|
| `/auth/signup`                   | POST              | Creates a new user account and generates a session to         | Guest                |
| `/auth/login`                    | POST              | Authenticates user credentials and generates a session token  | Guest                |
| `/profile`                       | GET               | Fetches details of the logged user                            | User                 |
| `/profile`                       | PUT               | Updates the profile of the logged user                        | User                 |
| `/profile/services`              | GET               | Fetches details of all services of the logged user            | User                 |
| `/profile/services/:id`          | GET               | Fetches details of a specific service of the logged user      | User                 |
| `/profile/services`              | POST              | Creates a new service                                         | User                 |
| `/profile/services/:id`          | DELETE            | Deletes a specific service                                    | User                 |
| `/profile/services/:id`          | PUT               | Update a specific service                                     | User                 |
| `/events`                        | GET               | Fetches a list of all events of the logged user               | User                 |
| `/events/:id`                    | GET               | Fetches details of a specific event of the logged user        | User                 |
| `/events`                        | POST              | Creates a new event                                           | User                 |
| `/events/:id`                    | DELETE            | Deletes a specific event                                      | User                 |
| `/events/:id/guest/:guestId`     | DELETE            | Deletes a specific guest from the list of the event           | User                 |
| `/events/:id`                    | PUT               | Update a specific event                                       | User                 |
| `/events/:id/guest`              | PUT               | Update a specific guest from the list of the event            | User                 |
| `/categories`                    | GET               | Fetches a list of all categories                              | Guest                |
| `/categories`                    | POST              | Creates a new category                                        | Admin                |
| `/services`                      | GET               | Fetches a list of all services                                | Guest                |
| `/reviews`                       | POST              | Creates a new review                                          | User                 |
| `/reviews/:id`                   | PUT               | Update a existing review                                      | User                 |
| `/requests`                      | GET               | Fetches a list of all requests service of the logged user     | User                 |
| `/requests`                      | POST              | Creates a new request                                         | User                 |
| `/requests/:id`                  | PUT               | Update state of a request                                     | User                 |
| `/notifications`                 | POST              | Creates a new notification                                   | -                    |
| `/notifications/latest/:userId?` | GET           | Fetches the latest notifications for the logged user or a specific user | User                 |
| `/notifications/all/:userId?`    | GET              | Fetches all notifications for the logged user or a specific user | User                 |
| `/notifications/:id/read`        | PUT               | Marks a specific notification as read                        | User                 |
| `/notifications/:id`             | DELETE            | Deletes a specific notification                              | Admin                |


## Data Model

### Collection "users" 
| Column          | Type                             |
| --------------- | -------------------------------- |
| _id             | ObjectId (Primary Key)           |
| first_name*     | String                           |
| last_name       | String                           |
| email*          | String (Unique)                  |
| password*       | String                           |
| img_url         | String                           |
| eventsCreated   | Array [ObjectId (ref: events)]   |
| servicesCreated | Array [ObjectId (ref: services)] |
| role            | String                           |


### Collection "events" 
| Column        | Type                             |
| ------------- | -------------------------------- |
| _id           | ObjectId (Primary Key)           |
| userId*       | ObjectId (ref: users)            |
| title*        | String                           |
| event_date    | Date                             |
| start_time    | String                           |
| end_time      | String                           |
| total_price   | Number (float)                   |
| img_url       | String                           |
| eventRequests | Array [ObjectId (ref: requests)] |
| guestList     | Array [_id, name, phone, number] |


### Collection "categories" 
| Column        | Type                    |
| ------------- | ----------------------- |
| _id           | ObjectId (Primary Key)  |
| title*        | String                  |
| icon          | String                  |


### Collection "services" 
| Column         | Type                              |
| -------------- | --------------------------------- |
| _id            | ObjectId (Primary Key)            |
| userId*        | ObjectId (ref: users)             |
| title*         | String                            |
| categoryId*    | ObjectId (ref: categories)        |
| latitude*      | Number                            |
| longitude*     | Number                            |
| max_capacity   | Number                            |
| min_capacity   | Number                            |
| start_time     | String                            |
| end_time       | String                            |
| img_url        | String                            |
| price*         | Number (float)                    |
| serviceReviews | Array [ObjectId (ref: requests)]  |


### Collection "requests" 
| Column           | Type                     |
| ---------------- | ------------------------ |
| _id              | ObjectId (Primary Key)   |
| serviceId*       | ObjectId (ref: services) |
| eventId*         | ObjectId (ref: events)   |
| state*           | String                   |
| date_of_request* | String                   |

### Collection "reviews" 
| Column           | Type                     |
| ---------------- | ------------------------ |
| _id              | ObjectId (Primary Key)   |
| serviceId*       | ObjectId (ref: services) |
| userId*          | ObjectId (ref: users)    |
| thumb*           | String                   |

### Collection "notifications"
| Column    | Type                        | Description                                  |
|-----------|-----------------------------|----------------------------------------------|
| _id       | ObjectId (Primary Key)      | Unique identifier for the notification      |
| userId*   | ObjectId (ref: users)       | The user who receives the notification      |
| message*  | String                      | The notification message                    |
| data      | Object                       | Additional data related to the notification |
| read      | Boolean (default: false)     | Indicates whether the notification is read  |
| createdAt | Date                        | Timestamp of creation (auto-generated)      |
| updatedAt | Date                        | Timestamp of last update (auto-generated)   |

## Author

EventSync was created by:

- Carolina (https://github.com/gcarolina03)


## Technologies Used

This project was built using:

- **NodeJS**: Runtime environment that allows executing server-side applications using JavaScript.
- **Mongoose**: MongoDB object modeling tool for NodeJS, providing a simple and flexible way to interact with MongoDB databases.
- **Express**: Fast and minimalist web application framework for NodeJS, enabling the creation of robust and scalable web applications and APIs.
- **Socket.io**: Enables real-time, bidirectional communication between clients and the server, used for live notifications and updates.

## Contributing

If you would like to contribute to EventSync, please submit a pull request with your changes. We welcome contributions of all kinds, including bug fixes, feature additions, and general improvements.

## Project Link

You can find the project on GitHub at: https://github.com/gcarolina03/eventSync-backend


## License

This project is licensed under the [MIT License](LICENSE).