function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
 
function randomName() {
    return (Math.random()+1).toString(36).substring(2);
}
 
// testbig
// insert data into a collection
// {number: 0, string: '', datetime: ISODate("2023-07-15T20:02:50.589Z")}
function testbig(database, collection, documentNumber, batchNumber, displayNumber, beginDate) {
    db = db.getSiblingDB(database);
    db.dropDatabase();
    col = db[collection];
    var bulk = col.initializeUnorderedBulkOp();
 
    for (index=1; index <= documentNumber; index++) {
        var newdate = randomDate(beginDate, new Date());
        var name = randomName();
        bulk.insert({number: index, string: name, datetime: newdate});
        if (index % batchNumber == 0) {
            bulk.execute()
            bulk = col.initializeUnorderedBulkOp();
        }
 
        if (index % displayNumber == 0) {
            print('-> inserted ' + index + ' documents.');
        }
    }
 
    let bulkOps = bulk.toJSON();
    if (bulkOps.nInsertOps != 0 || bulkOps.nUpdateOps != 0 || bulkOps.nRemoveOps != 0 || bulkOps.nBatches != 0) {
        bulk.execute();
    }
    let count = col.countDocuments();
    print('--> count ' + count);
}

const start = new Date();
testbig('testbig', 'stresstab', 1000000, 1000, 100000, new Date(2012, 0, 1));
print("time elapsed " + (new Date() - start)/1000.0 + "s");
