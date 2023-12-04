npx sequelize-cli model:generate --name Region --attributes id:string,name:string

npx sequelize-cli model:generate --name Channel --attributes id:string,title:text,videosPublished:integer

npx sequelize-cli model:generate --name Category --attributes id:integer,title:string,assignable:boolean,etag:string

npx sequelize-cli model:generate --name Video --attributes title:text,publishedAt:date,tags:text,\
viewCount:integer,likes:integer,dislikes:integer,commentCount:integer,thumbnailLink:text,commentsDisabled:boolean,\
ratingsDisabled:boolean,description:text,channelId:string,categoryId:integer,dowPublished:integer

npx sequelize-cli model:generate --name Trend --attributes videoId:string,regionId:string,trendingDate:date,\
viewCount:integer,likes:integer,dislikes:integer,commentCount:integer,commentsDisabled:boolean,ratingsDisabled:boolean,\
channelId:string,categoryId:integer