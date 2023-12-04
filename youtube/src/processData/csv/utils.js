export const extractTrend = (data, regionCode) => {
    const trend = {
        trendingDate: data?.trending_date,
        videoId: data?.video_id,
        title: data?.title,
        channelTitle: data?.channelTitle,
        publishedAt: data?.publishedAt,
        tags: data?.tags,
        viewCount: parseInt(data?.view_count),
        likes: parseInt(data?.likes),
        dislikes: parseInt(data?.dislikes),
        commentCount: parseInt(data?.comment_count),
        thumbnailLink: data?.thumbnail_link,
        commentsDisabled:
            String(data?.comments_disabled).toLowerCase() === 'true',
        ratingsDisabled:
            String(data?.ratings_disabled).toLowerCase() === 'true',
        description: data?.description,

        channelId: data?.channelId,
        categoryId: parseInt(data?.categoryId),
        regionId: regionCode
    };

    return trend;
};
