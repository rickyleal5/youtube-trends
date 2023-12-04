const regions = [
    {
        id: 'US',
        name: 'United States of America'
    }
];

const categories = [
    {
        id: 1,
        title: 'Film & Animation',
        assignable: true,
        etag: 'qwerty1'
    },
    {
        id: 2,
        title: 'Autos & Vehicles',
        assignable: true,
        etag: 'qwerty2'
    },
    {
        id: 3,
        title: 'Music',
        assignable: true,
        etag: 'qwerty3'
    }
];

const channels = [
    {
        id: 'channel1',
        title: 'Movie Recaps',
        videosPublished: null
    },
    {
        id: 'channel2',
        title: 'Cars',
        videosPublished: null
    },
    {
        id: 'channel3',
        title: 'Good Music',
        videosPublished: null
    }
];

const videos = [
    {
        id: 'video1',
        title: 'Movie 1 recap',
        publishedAt: new Date('2023-01-01T00:00:00Z').getTime(),
        dowPublished: new Date('2023-01-01T00:00:00Z').getUTCDay(),
        channelId: 'channel1',
        categoryId: 1,
        tags: 'movie|cinema|anime',
        viewCount: 423489,
        likes: 12784,
        dislikes: 0,
        commentCount: 234,
        thumbnailLink: 'https://example.com/video1/default.jpg',
        commentsDisabled: false,
        ratingsDisabled: false,
        description: 'Podcast about Movie 1'
    },
    {
        id: 'video2',
        title: 'My new sedan',
        publishedAt: new Date('2023-01-01T00:00:00Z').getTime(),
        dowPublished: new Date('2023-01-01T00:00:00Z').getUTCDay(),
        channelId: 'channel2',
        categoryId: 2,
        tags: 'fast|slow|car|speed',
        viewCount: 130293,
        likes: 34284,
        dislikes: 1,
        commentCount: 2384,
        thumbnailLink: 'https://example.com/video2/default.jpg',
        commentsDisabled: false,
        ratingsDisabled: false,
        description: 'Look at my new car'
    },
    {
        id: 'video3',
        title: 'Relaxing sounds',
        publishedAt: new Date('2023-01-01T00:00:00Z').getTime(),
        dowPublished: new Date('2023-01-01T00:00:00Z').getUTCDay(),
        channelId: 'channel3',
        categoryId: 3,
        tags: '[None]',
        viewCount: 234534,
        likes: 34224,
        dislikes: 0,
        commentCount: 0,
        thumbnailLink: 'https://example.com/video3/default.jpg',
        commentsDisabled: true,
        ratingsDisabled: false,
        description: 'Music to relax'
    }
];

const trends = [
    {
        videoId: 'video1',
        channelId: 'channel1',
        categoryId: 1,
        regionId: 'US',
        trendingDate: new Date('2023-02-01T00:00:00Z').getTime(),
        viewCount: 423489,
        likes: 12784,
        dislikes: 0,
        commentCount: 234,
        commentsDisabled: false,
        ratingsDisabled: false
    },
    {
        videoId: 'video2',
        channelId: 'channel2',
        categoryId: 2,
        regionId: 'US',
        trendingDate: new Date('2023-02-01T00:00:00Z').getTime(),
        viewCount: 130293,
        likes: 34284,
        dislikes: 1,
        commentCount: 2384,
        commentsDisabled: false,
        ratingsDisabled: false
    },
    {
        videoId: 'video3',
        channelId: 'channel3',
        categoryId: 3,
        regionId: 'US',
        trendingDate: new Date('2023-02-01T00:00:00Z').getTime(),
        viewCount: 234534,
        likes: 34224,
        dislikes: 0,
        commentCount: 0,
        commentsDisabled: true,
        ratingsDisabled: false
    },
    {
        videoId: 'video3',
        channelId: 'channel3',
        categoryId: 3,
        regionId: 'US',
        trendingDate: new Date('2023-02-02T00:00:00Z').getTime(),
        viewCount: 234534,
        likes: 34224,
        dislikes: 0,
        commentCount: 0,
        commentsDisabled: true,
        ratingsDisabled: false
    }
];

export const mocks = {
    regions,
    categories,
    channels,
    videos,
    trends
};
