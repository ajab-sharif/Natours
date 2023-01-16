class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const qureyObj = { ...this.queryStr };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete qureyObj[el]);
        // 2A) Advance Filtering 
        let queryStr = JSON.stringify(qureyObj);
        queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/g, match => `$${match}`);
        this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    fieldsLimit() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);
        return this;
    }
};
module.exports = ApiFeatures;