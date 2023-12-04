import countries from 'i18n-iso-countries';

export const extractRegion = (data) => {
    const region = {
        id: data.regionCode,
        name: countries.getName(data.regionCode, 'en')
    };
    return region;
};

export const extractCategories = (data) => {
    const categories = data.json.items.reduce((accumulator, current) => {
        const category = {
            id: parseInt(current.id),
            etag: current?.etag,
            title: current?.snippet?.title,
            assignable: current?.snippet?.assignable
        };
        accumulator.push(category);
        return accumulator;
    }, []);

    return categories;
};
