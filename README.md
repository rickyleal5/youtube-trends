# YouTube trends

Analysis of daily top trending YouTube videos from a dataset on Kaggle.

**Kaggle dataset:**

[*"YouTube Trending Video Dataset (updated daily)"* (Version 1186)](https://www.kaggle.com/datasets/rsrishav/youtube-trending-video-dataset/versions/1186) by [Rishav Sharma](https://www.kaggle.com/rsrishav)

### Project summary

This project runs a [Node.js](https://nodejs.org/en) program that streams the data in the dataset files to a [TimescaleDB](https://www.timescale.com/) database. The database structure is created using [Sequelize](https://sequelize.org/) models that represent the tables in the database. The data visualizations are displayed on interactive dashboards made on [Grafana](https://grafana.com/grafana/). Both Grafana and TimescaleDB run in [Docker](https://www.docker.com/) containers. Unit testing is done using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) and can be run locally or on a CI/CD workflow using [GitHub Actions](https://github.com/features/actions).


#### Database schema

![Database schema](/images/database-schema.png)


### Analysis
Read the analysis report I made about this dataset:
[Analysis](/analysis/youtube-trends.pdf)

### Demo

**Click on the image** to watch the demo video on YouTube
[![Demo](/images/youtube-trends-demo.png)](https://www.youtube.com/watch?v=9AQDVdwuMhM)


This demo ran on a VM usuing Ubuntu v22.04.3 64bit (ubuntu-22.04.3-desktop-amd64.iso) on Oracle VM VirtualBox with 3024MB of base memory, 3 processors and 45GB of storage.

**Notes**

The original idea was to only make dashboards for each individual Region/Category/Channel/Video. The indexes for the tables are not made for the queries on the general dashboards which lack the WHERE clause (in most of them). However, some of the queries in the general dashboards load fast thanks to materialized views though. The queries in the individual dashboards run much faster.


### Run it

**Pre-requisites:**

- Node.js - 18.0.0
- npm - 9.8.1
- nvm - 0.39.5
- Docker - 24.0.7, build afdd53b
- Docker compose - v2.21.0

**Steps**

1. Download the dataset from Kaggle. Unzip it and store the files in a directory called *archive*.

2. Start containers, install packages and load the data:
```console
npm run docker:up
npm i
npm run start
```

3. To access Grafana, open on your browser: [localhost:3000](http://localhost:3000)
```
Username: admin
Password: admin
```
4. Interact with the dashboards on Grafana.

5. To stop the containers:
```console
npm run docker:down
```