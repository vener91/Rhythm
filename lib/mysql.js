var mysql = require('mysql');
var rutil = require(__dirname + '/rutil');

/* This makes the connection to the database */
exports.db = {
    client: mysql.createClient({
        user: 'root',
        password: 'root',
    }),
    //Important variables
    lastInsertID: null,
    //low level functions
    /**
     * Mysql Query
     * @param sql String of Query
     * @param callback Callback
     * @return db
     */
    query: function(sql, callback){
        this.client.query(sql, callback);
        return this;
    },
    setLastID: function(){
            
    },
    getSingleRow: function(sql, callback){
        this.query(sql, function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            callback(results);
            console.log(results);
            console.log(fields);
            client.end();
        });
        return this;
    },
    insert: function(table, data, filter, callback) {
            
        if (typeof(data[0]) === 'undefined') {
            data = [data];
        }
        if (typeof(filter) != 'undefined') {
            fields = filter.join(',');
        } else {
            fields = rutil.arrayKeys(data[0]).join(',');
        }
        var values = '';
        var size = data.length;
        for (var i = 0; i < size; i++) { //Interate over all rows
            var value = '';
            if (typeof(filter) != 'undefined') {
                size = filter.length;
                for (var j = 0; j < size; j++) {
                    if (data[filter[j]] === null) {
                        value += "NULL,";
                    } else {
                        value += "'" + this.client.escape(data[i][filter[j]]) + "',";
                    }
                }
            } else {
                for(field in data[i]) {
                    if (data[i][field] === null) {
                        value += "NULL,";
                    } else {
                        value += this.client.escape(data[i][field]) + ',';
                    }
                }
            }
            values += '(' + value.slice(0, -1) + '),';
        }

        this.query('INSERT INTO ' + table + ' (' + fields + ') VALUES ' + values.slice(0, -1), function(err, info) {
            if(typeof(callback) === 'function'){
                callback(err, info);
            }
            
            console.log(info.insertId);
        });
            
        return this;
    }
}
exports.db.client.useDatabase('rhythm');
