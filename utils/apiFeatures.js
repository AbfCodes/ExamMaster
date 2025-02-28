module.exports = class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    // 1A) BASIC FILTERING
    const queryObj = { ...this.queryString }
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach((el) => delete queryObj[el])

    // 1B) ADVANCE QUERY
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else this.query = this.query.sort('-createdAt')

    return this
  }

  limitFields() {
    // 3) FIELD LIMITING OR PROJECTING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else this.query = this.query.select('-__V')

    return this
  }

  paginate() {
    //  PAGINATION
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit

    // http://localhost:8000/api/v1/tours/"page=2&limit=20"
    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}
