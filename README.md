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


| Endpoint                                   | Description                                                   | Role                  |
|--------------------------------------------|---------------------------------------------------------------|-----------------------|
| `/api/auth/signup`                         | Creates a new user account and generates a session to         | Guest                 |
| `/api/auth/login`                          | Authenticates user credentials and generates a session token  | Guest                 |

## Data Model

### Collection "users" 
| Column      | Type                    |
| ----------- | ----------------------- |
| _id         | ObjectId (Primary Key)  |
| first_name  | String                  |
| last_name   | String                  |
| email       | String (Unique)         |
| password    | String                  |
| img_url     | String                  |

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