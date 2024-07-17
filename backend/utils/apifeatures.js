class ApiFeatures {
    constructor(query,queryStr) {
        this.query = query
        this.queryStr = queryStr
    }
    search()
    {
        const keyword = this.queryStr.keyword ? 
        {
            name : {
                $regex : this.queryStr.keyword,
                $options : "i"
            }
        }
        :
        {}
        this.query = this.query.find({...keyword})
        return this
    }
    filter()
    {
        //note that queries should have keys in this fashion:-
        //keyword : "",
        //page : ,
        //limit : ,
        //category : "",
        //price : {gt : , lt : }
        //here in mongoDB $gt and $lt are operators in queries which 
        //gives values which are greater than and less than respectively
        const queryCopy = {...this.queryStr}
        const removeFields = ["keyword","page","limit"]
        removeFields.forEach((key)=>{ delete queryCopy[key]})

        // //let's now make gt and lt keys as $gt and $lt
        // let queryCopyModified = JSON.stringify(queryCopy)
        // queryCopyModified.replace(("gt"|"gte"|"lt"|"lte"),(key)=> `$${key}`)
        // //here we are replacing gt, gte(greater_than_or_equal_to), lt, lte(lesser_than_or_equal_to) 
        // //with $gt, $gte, $lt, $lte respectively
        // let finalquery = JSON.parse(queryCopyModified) 
        // //here we are converting values from string to int 
        
        let finalquery = queryCopy
        
        if(finalquery.price){
        if(finalquery.price.gt)
        {
            if(finalquery.price.lt)
            {
                finalquery.price.$gt = parseInt(finalquery.price.gt)
                finalquery.price.$lt = parseInt(finalquery.price.lt)
                delete finalquery.price.gt
                delete finalquery.price.lt
            }
        }
        if(finalquery.price.gte)
        {
            if(finalquery.price.lte)
            {
                finalquery.price.$gte = parseInt(finalquery.price.gte)
                finalquery.price.$lte = parseInt(finalquery.price.lte)
                delete finalquery.price.gte
                delete finalquery.price.lte
            }
        }
        }
        if(finalquery.ratings){
            if(finalquery.ratings.gt)
            {
                finalquery.ratings.$gt = parseInt(finalquery.ratings.gt)
                delete finalquery.ratings.gt
                if(finalquery.ratings.lt)
                {
                    finalquery.ratings.$lt = parseInt(finalquery.ratings.lt)
                    delete finalquery.ratings.lt
                }
            }
            if(finalquery.ratings.gte)
            {
                finalquery.ratings.$gte = parseInt(finalquery.ratings.gte)
                delete finalquery.ratings.gte
                if(finalquery.ratings.lte)
                {
                    finalquery.ratings.$lte = parseInt(finalquery.ratings.lte)
                    delete finalquery.ratings.lte
                }
            }
            }
        this.query = this.query.find(finalquery)
        return this
    }
    pagination(resultperpage)
    {
        const currentPage = parseInt(this.queryStr.page) || 1
        //now let's calculate how many products we need to skip
        //that means for example if we have to show 10 products for a page 
        //and we have a total of 50 products, and we have to show the 2nd page then 
        //we gotta skip 10 products and show the second ten
        const skip = resultperpage * (currentPage - 1)
        if(skip != 0){
            this.query = this.query.limit(resultperpage).skip(skip)
        }
        else{
            this.query = this.query.limit(resultperpage)
        }
        return this
    }
}

module.exports = ApiFeatures


/*
Let's walk through the execution of the method chain `.search().filter().pagination` on an instance of the 
`ApiFeatures` class with a MongoDB model `Product.find()` as the initial query and `req.query` as the `queryStr`. 
I'll explain the changes happening in `this.query` at each step:

1. **Initial State:**
   - `this.query`: The initial query is `Product.find()`.
   - `this.queryStr`: The query string is obtained from `req.query`.

2. **`.search()`:**
   - The `search()` method checks if there is a keyword in `this.queryStr`.
   - If a keyword exists, it constructs a regex query for the "name" field.
   - The `this.query` is then updated to include the regex query.
   - So, `this.query` now includes the search criteria.

3. **`.filter()`:**
   - The `filter()` method creates a copy of `this.queryStr` named `queryCopy`.
   - It removes certain fields (keyword, page, limit) from `queryCopy`.
   - It modifies the `finalquery` object based on certain conditions (e.g., converting price.gt to $gt).
   - The `this.query` is then updated to include the `finalquery`.
   - So, `this.query` now includes additional filtering criteria.

4. **`.pagination(resultPerPage)`:**
   - The `pagination()` method calculates the `skip` value based on the current page and result per page.
   - It updates `this.query` to include `limit(resultPerPage).skip(skip)`.
   - So, `this.query` now includes pagination settings.

At the end of the method chain, `this.query` has been modified to include the search criteria, additional filtering, 
and pagination settings. The final `this.query` is a MongoDB query object that represents the combined criteria for searching, 
filtering, and paginating the results.

Here's a simplified representation of the changes:

```javascript
// Initial State
this.query = Product.find();
this.queryStr = req.query;

// After .search()
this.query = this.query.find({...searchCriteria});

// After .filter()
this.query = this.query.find({...searchCriteria, ...filterCriteria});

// After .pagination()
this.query = this.query.limit(resultPerPage).skip(skip);
```

Note: The actual content of `searchCriteria` and `filterCriteria` depends on the data and conditions in `req.query`.
*/

//possible question you might have:-

/*
Question:- when we write update this.query in .filter method why doesn't this.query get updated 
to this.query.find({...filterCriteria}) but instead gets updated to this.query.find({...searchCriteria, ...filterCriteria})?
Answer:- 
Let's clarify the behavior in the `.filter()` method.

In the `.filter()` method, the line:

```javascript
this.query = this.query.find(finalquery);
```

Is responsible for updating `this.query`, but it does not replace the existing query. Instead, it adds more conditions to the existing query. 
The `find()` method is cumulative in Mongoose. It doesn't clear the existing query; it appends additional conditions.
So, if `this.query` had already been modified by a previous `.search()` method, the line above will further modify it by adding the conditions specified 
in `finalquery`. The `finalquery` includes both the search criteria and the filter criteria.
If you want to replace the existing query entirely, you can do so by using `Model.find()` without chaining it onto the existing query:

```javascript
this.query = this.query.model.find(finalquery);
```

This way, you start with a fresh `Model.find()` query, and you only apply the conditions from `finalquery`. This will replace the existing query with the new conditions.

Here's how the `.filter()` method could look:

```javascript
filter() {
  const queryCopy = { ...this.queryStr };
  const removeFields = ["keyword", "page", "limit"];
  removeFields.forEach((key) => {
    delete queryCopy[key];
  });

  let finalquery = queryCopy;

  // ... (modify finalquery based on conditions)

  // Replace the entire query
  this.query = this.query.model.find(finalquery);
  return this;
}
```

This ensures that the existing query is replaced with a new query that includes only the conditions specified in `finalquery`.
*/

//Another possible question you might have:-

/*
Question:- so does this mean this.query only stores the method call and not the returned values? if yes, why?
Answer:-
Yes, that's correct. In Mongoose, `this.query` is a reference to the Mongoose `Query` object, 
which represents a pending query to be executed on the database. It stores the method calls and query conditions, not the actual results of those queries.

Here's why:

1. **Query Building:**
   The `Query` object is used to build up a MongoDB query incrementally. Each method call on the `Query` 
   object modifies the query by adding conditions, projections, or other parameters.

2. **Lazy Execution:**
   Mongoose uses a concept known as "lazy execution." This means that the actual execution of the query 
   against the MongoDB database is deferred until a method that requires the results is called (e.g., `exec()`). 
   This allows you to build up complex queries before actually sending them to the database.

3. **Chaining:**
   Method chaining is a common pattern in Mongoose. Each method call on the `Query` object returns a new `Query` 
   object with the additional modifications. This allows you to chain multiple method calls together, building up the query step by step.

Here's an example to illustrate this:

```javascript
// This doesn't execute the query yet
const query = Model.find({ name: 'John' });

// This still doesn't execute the query
const modifiedQuery = query.sort({ age: 1 });

// Now, when you call exec(), the query is executed
modifiedQuery.exec((err, results) => {
  // Handle results or errors
});
```

In the above example, `query` and `modifiedQuery` are both `Query` objects that represent MongoDB queries. The actual execution happens when you call `exec()`.

By storing the method calls and query conditions, Mongoose allows you to build up queries dynamically and execute them when needed, 
which can be more efficient in terms of database interactions. It also provides a clean and expressive way to work with MongoDB queries in your code.
*/