# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact


### Add Classes and Subjects

curl --location 'https://us-central1-ezlessons-v1.cloudfunctions.net/createClass' \
--header 'Content-Type: application/json' \
--data '{
    "class": [
        {
            "name": "JEE",
            "desc": "",
            "subjects": [
                {
                    "name": "CHEMISTRY",
                    "image": "https://d20x1nptavktw0.cloudfront.net/wordpress_media/2022/03/excellent-scores-in-NEET-Chemistry.jpg",
                    "amount": 99,
                    "desc": ""
                },
                {
                    "name": "MATHS",
                    "desc": "",
                    "image": "https://yt3.googleusercontent.com/ytc/AGIKgqMYgHqYg4eBP1jZGBsBXYpfhTPTFXYyPsswUCdG=s900-c-k-c0x00ffffff-no-rj",
                    "amount": 99
                },
                {
                    "name": "PHYSICS",
                    "desc": "",
                    "image": "https://d20x1nptavktw0.cloudfront.net/wordpress_media/2022/04/Blog-Image-49.jpg",
                    "amount": 99
                }
            ]
        }
    ]
}'